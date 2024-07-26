const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchInternships() {
    const response = await fetch('https://jobs-api19.p.rapidapi.com/jobs?limit=100', {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'c3a93bdf12msh044a4433f9b5e76p120876jsnc4884cc19b72',
            'X-RapidAPI-Host': 'jobs-api19.p.rapidapi.com'
        }
    });

    if (!response.ok) {
        'https://jobs-api19.p.rapidapi.com/jobs?limit=100'
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.message}`);
    }
    const data = await response.json();
    return data;
}

async function updateCacheForListing(listing) {
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
}

async function saveInternships() {
    try {
        const internships = await fetchInternships();

        if (!Array.isArray(internships)) {
            console.error('Error: internships is not an array');
            return;
        }

        for (const job of internships) {
            const upsertedInternship = await prisma.internship.upsert({
                where: {
                    title_company: {
                        title: job.title,
                        company: job.company
                    }
                },
                update: {
                    title: job.title,
                    jobTitle: job.job_title,
                    jobType: job.job_type,
                    location: job.location,
                    description: job.job_description,
                    qualifications: job.education_and_skills,
                    url: job.apply_link,
                    postedAt: new Date(job.posted_date)
                },
                create: {
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

            await updateCacheForListing(upsertedInternship);

        }
    } catch (error) {
        console.error(error);
    }
}

saveInternships()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
