const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
    const {
        userId, firstName, lastName, email, password, userType, school, gpa, major, gender,
        raceEthnicity, technicalSkills, previousInternships, company, companyCulture
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                userId,
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
                previousInternships,
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

        const token = jwt.sign({ userId: user.id }, 'secretkey');
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
