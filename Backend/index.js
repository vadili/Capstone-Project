require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied, token missing!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token is not valid' });
        req.user = user;
        next();
    });
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
                technicalSkills,
                previousInternships: previousInternships || null,
                company,
                companyCulture
            }
        });
        res.status(201).json(user);
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

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        res.json(user);
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
                previousInternships,
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
