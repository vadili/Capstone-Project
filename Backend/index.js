require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true
    },
});

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
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

    socket.on('disconnect', (reason) => {
    });
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const updateCacheForListing = async (listing) => {
    const { id, title, description } = listing;
    const words = new Set([...title.split(/\W+/), ...description.split(/\W+/)]);

    for (const word of words) {
        if (word) {
            const lowerCaseWord = word.toLowerCase();
            const titleScore = (title.toLowerCase().split(lowerCaseWord).length - 1) * 10;
            const bodyScore = Math.min((description.toLowerCase().split(lowerCaseWord).length - 1), 5);
            const totalScore = titleScore + bodyScore;

            await prisma.cachedScore.upsert({
                where: { internshipId_word: { internshipId: id, word: lowerCaseWord } },
                update: { score: totalScore },
                create: {
                    internship: {
                        connect: {
                            id,
                        },
                    },
                    word: lowerCaseWord,
                    score: totalScore
                },
            });

            const cachedScores = await prisma.cachedScore.findMany({
                where: { word: lowerCaseWord },
                orderBy: { score: 'desc' }
            });

            if (cachedScores.length > 10) {
                const scoresToDelete = cachedScores.slice(10);
                const deletePromises = scoresToDelete.map(score => prisma.cachedScore.delete({
                    where: { id: score.id }
                }));
                await Promise.all(deletePromises);
            }
        }
    }
};

const cacheExistingInternships = async () => {
    try {
        const internships = await prisma.internship.findMany();

        for (const internship of internships) {
            await updateCacheForListing(internship);
        }
    } catch (error) {
        console.error('Error caching existing internships:', error);
    }
};

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

app.post('/api/announcements', authenticateToken, upload.single('photo'), async (req, res) => {
    const { content } = req.body;
    let photoPath = null;

    if (req.file) {
        const fileBuffer = req.file.buffer;
        const fileName = `${req.user.userId}_${Date.now()}_${req.file.originalname}`;
        const uploadDir = path.join(__dirname, 'uploads');
        const filePath = path.join(uploadDir, fileName);
        photoPath = `uploads/${fileName}`;

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(filePath, fileBuffer);
    }

    try {
        const announcement = await prisma.announcement.create({
            data: {
                content,
                photo: photoPath,
                userId: req.user.userId
            }
        });

        io.emit('announcement', announcement);

        res.status(201).json(announcement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/announcements', authenticateToken, async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
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

        const existingInternship = await prisma.internship.findUnique({
            where: {
                title_company: {
                    title,
                    company
                }
            }
        });

        if (existingInternship) {
            return res.status(400).json({ error: 'An internship with this title and company already exists' });
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

        await updateCacheForListing(newInternship);

        const students = await prisma.user.findMany({
            where: { userType: 'student' }
        })

        await Promise.all(students.map(student => prisma.notification.create({
            data: {
                content: `New internship created: ${jobTitle} at ${company}`,
                userId: student.id
            }
        })));

        io.emit('announcement', {
            content: `New internship created: ${jobTitle} at ${company}`,
        });

        res.status(201).json(newInternship);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/search', async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    const lowerCaseKeyword = keyword.toLowerCase();

    try {
        const cachedScores = await prisma.cachedScore.findMany({
            where: { word: lowerCaseKeyword },
            orderBy: { score: 'desc' },
            include: { internship: true },
            take: 10
        });

        const internships = cachedScores.map(score => score.internship);
        res.json(internships);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const cleanUpCache = async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    await prisma.cachedScore.deleteMany({
        where: {
            updatedAt: {
                lt: tenMinutesAgo,
            },
        },
    });
};

setInterval(cleanUpCache, 10 * 60 * 1000);

app.get('/api/internships', async (req, res) => {
    try {
        const internships = await prisma.internship.findMany();
        res.json(internships);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/internships', authenticateToken, async (req, res) => {
    const { id, title, jobTitle, jobType, company, location, description, qualifications, url } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.userType !== 'recruiter') {
            return res.status(403).json({ error: 'User is not authorized to edit internships' });
        }

        const recruiter = await prisma.recruiter.findUnique({
            where: { email: user.email }
        });

        if (!recruiter) {
            return res.status(404).json({ error: 'Recruiter not found' });
        }

        const internship = await prisma.internship.findUnique({
            where: { id: parseInt(id) }
        });

        if (!internship) {
            return res.status(404).json({ error: 'Internship not found' });
        }

        if (internship.recruiterId !== recruiter.id) {
            return res.status(403).json({ error: 'User is not authorized to edit this internship' });
        }

        const updatedInternship = await prisma.internship.update({
            where: { id: parseInt(id) },
            data: {
                title,
                jobTitle,
                jobType,
                company,
                location,
                description,
                qualifications,
                url
            }
        });

        res.json(updatedInternship);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/internships/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const internship = await prisma.internship.findUnique({
            where: { id: parseInt(id) },
        });

        if (!internship) {
            return res.status(404).json({ error: 'Internship not found' });
        }

        res.json(internship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/internships/:id', async (req, res) => {
    const { id } = req.params;
    const { title, jobTitle, jobType, company, location, description, qualifications, url } = req.body;
    try {
        const internship = await prisma.internship.update({
            where: { id: parseInt(id) },
            data: {
                title,
                jobTitle,
                jobType,
                company,
                location,
                description,
                qualifications,
                url,
            },
        });

        res.json(internship);
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
                savedInternships: true
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
                seenAnnouncements: true,
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

app.post('/api/users/:userId/:announcementId/seenAnnouncements', async (req, res) => {
    const { userId, announcementId } = req.params;
    const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
            seenAnnouncements: {
                connect: { id: parseInt(announcementId) },
            },
        },
    });
    res.json(user);
});

app.put('/api/user/profile-picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    const userId = req.user.userId;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${userId}_${Date.now()}_${req.file.originalname}`;
    const uploadDir = path.join(__dirname, 'uploads');
    const filePath = path.join(uploadDir, fileName);
    const relativeFilePath = `uploads/${fileName}`;

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, fileBuffer);

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { profilePicture: relativeFilePath },
        });

        res.json(user);
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Internal server error' });
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
            where: { userId: req.user.userId, isRead: false },
            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],
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

server.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await cacheExistingInternships();
    setInterval(cleanUpCache, 10 * 60 * 1000);
});
