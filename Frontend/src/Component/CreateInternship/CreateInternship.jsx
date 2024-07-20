import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './CreateInternship.css';

const CreateInternship = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        jobTitle: '',
        jobType: '',
        company: '',
        location: '',
        description: '',
        qualifications: '',
        url: ''
    });

    const [urlError, setUrlError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'url') {
            const urlPattern = new RegExp('^(https?:\\/\\/)' +
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
                '((\\d{1,3}\\.){3}\\d{1,3}))' +
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                '(\\?[;&a-z\\d%_.~+=-]*)?' +
                '(\\#[-a-z\\d_]*)?$', 'i');
            setUrlError(urlPattern.test(value) ? '' : 'Invalid URL');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (urlError) return;

        const token = localStorage.getItem('token');
        const authToken = (token.split(' ')[1]);

        try {
            const response = await fetch('http://localhost:3001/api/internships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const newInternship = await response.json();
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                console.error('Error creating internship:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="create-internship-container">
                <form className="create-internship-form" onSubmit={handleSubmit}>
                    <h2>Create New Internship</h2>
                    <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                    <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required />
                    <input type="text" name="jobType" placeholder="Job Type" value={formData.jobType} onChange={handleChange} required />
                    <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
                    <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
                    <textarea name="qualifications" placeholder="Qualifications" value={formData.qualifications} onChange={handleChange} required></textarea>
                    <input type="text" name="url" placeholder="URL" value={formData.url} onChange={handleChange} required />
                    {urlError && <p className="error">{urlError}</p>}
                    <button type="submit" disabled={!!urlError}>Create</button>
                </form>
            </div>
        </>
    );
};

export default CreateInternship;
