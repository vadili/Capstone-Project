const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchInternships() {
    const response = await fetch('https://jobs-api19.p.rapidapi.com/jobs', {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'c3a93bdf12msh044a4433f9b5e76p120876jsnc4884cc19b72',
            'X-RapidAPI-Host': 'jobs-api19.p.rapidapi.com'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.message}`);
    }

    const data = await response.json();
    console.log('API response data:', data);

    return data; // Directly return the data as it's an array of jobs
}

async function saveInternships() {
    try {
        const internships = await fetchInternships();
        console.log('Internships data:', internships);

        if (!Array.isArray(internships)) {
            console.error('Error: internships is not an array');
            return;
        }

        for (const job of internships) {
            await prisma.internship.create({
                data: {
                    title: job.title,
                    jobTitle: job.job_title,
                    jobType: job.job_type,
                    company: job.company,
                    location: job.location,
                    description: job.job_description,
                    qualifications: job.education_and_skills,
                    url: job.apply_link,
                    postedAt: new Date(job.posted_date)
                }
            });
        }
        console.log('Internships saved successfully');
    } catch (error) {
        console.error(error);
    }
}

saveInternships()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });