require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied, token missing!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token is not valid' });
        req.user = user;
        next();
    });
};

io.on('connection', (socket) => {

    socket.on('newAnnouncement', (announcement) => {
        io.emit('announcement', announcement);
    });

    socket.on('disconnect', () => {
    });
});

app.use(bodyParser.json());
app.use(cors());

app.post('/signup', async (req, res) => {
    const {
        firstName, lastName, email, password, confirmPassword, userType, school, gpa, major, gender,
        raceEthnicity, technicalSkills, previousInternships, company, companyCulture
    } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                userType,
                school,
                gpa,
                major,
                gender,
                raceEthnicity,
                technicalSkills: JSON.parse(technicalSkills),
                previousInternships: previousInternships || null,
                company,
                companyCulture
            }
        });

        if (userType === 'recruiter') {
            await prisma.recruiter.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    company
                }
            });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '4h' });
        res.status(201).json({ token, user });
    } catch (error) {
        console.error("Error during user creation:", error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/internships', authenticateToken, async (req, res) => {
    const { title, jobTitle, jobType, company, location, description, qualifications, url } = req.body;
    try {

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.userType !== 'recruiter') {
            return res.status(403).json({ error: 'User is not authorized to create internships' });
        }

        const recruiter = await prisma.recruiter.findUnique({
            where: { email: user.email }
        });

        if (!recruiter) {
            return res.status(404).json({ error: 'Recruiter not found' });
        }

        const newInternship = await prisma.internship.create({
            data: {
                title,
                jobTitle,
                jobType,
                company,
                location,
                description,
                qualifications,
                url,
                postedAt: new Date(),
                recruiterId: parseInt(recruiter.id)
            }
        });

        const students = await prisma.user.findMany({
            where: { userType: 'student' }
        })

        await Promise.all(students.map(student => prisma.notification.create({
            data: {
                content: `New internship created: ${jobTitle} at ${company}`,
                userId: student.id
            }
        })));

        io.emit('announcement', `New internship created: ${jobTitle} at ${company}`);
        res.status(201).json(newInternship);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/internships', async (req, res) => {
    try {
        const internships = await prisma.internship.findMany();
        res.json(internships);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/internships/:id/save', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                savedInternships:
                    { connect: { id: parseInt(id) } }
            },
            include: {
                savedInternships: true  // Include savedInternships in the result
            }
        });
        res.json(updatedUser.savedInternships);
    } catch (error) {
        console.error('Error in /api/internships/:id/save:', error);
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/internships/:id/save', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                savedInternships: {
                    disconnect: { id: parseInt(id) }
                }
            },
            include: { savedInternships: true }
        });

        res.json(updatedUser.savedInternships);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/internships/:id/like', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                likedInternships:
                    { connect: { id: parseInt(id) } }
            },
            include: {
                likedInternships: true
            }
        });
        res.json(updatedUser.likedInternships);
    } catch (error) {
        console.error('Error in /api/internships/:id/like:', error);
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/internships/:id/like', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                likedInternships: {
                    disconnect: { id: parseInt(id) }
                }
            },
            include: { likedInternships: true }
        });

        res.json(updatedUser.likedInternships);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '4h' });
        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: {
                savedInternships: true,
                likedInternships: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/user', authenticateToken, async (req, res) => {
    const {
        firstName, lastName, email, userType, school, gpa, major, gender, raceEthnicity, technicalSkills, previousInternships, company, companyCulture
    } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                firstName,
                lastName,
                email,
                userType,
                school,
                gpa,
                major,
                gender,
                raceEthnicity,
                technicalSkills,
                previousInternships: previousInternships !== null ? parseInt(previousInternships) : null,
                company,
                companyCulture
            }
        });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/user', authenticateToken, async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: req.user.userId }
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/notifications', authenticateToken, async (req, res) => {
    const { content } = req.body;
    try {
        const users = await prisma.user.findMany({
            where: { userType: 'student' }
        });

        const notifications = users.map(user => {
            return prisma.notification.create({
                data: {
                    content,
                    userId: user.id
                }
            });
        });

        await Promise.all(notifications);

        io.emit('announcement', content);
        res.status(201).json({ message: 'Notification sent to all students', notifactions: notifications });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.userId, isRead: false }
        });
        res.json(notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/notifications/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await prisma.notification.update({
            where: { id: parseInt(id) },
            data: { isRead: true }
        });
        res.json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/notifications/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await prisma.notification.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/recruiter/internships/:email', async (req, res) => {
    const { email } = req.params
    try {
        const recruiter = await prisma.recruiter.findUnique({
            where: { email: email }
        });


        if (!recruiter) {
            return res.status(404).json({ error: 'Recruiter not found' });
        }
        const internships = await prisma.internship.findMany({
            where: { recruiterId: parseInt(recruiter.id) }
        });

        res.json(internships);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
