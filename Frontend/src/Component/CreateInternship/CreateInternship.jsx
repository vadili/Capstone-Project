import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './CreateInternship.css';

const CreateInternship = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        jobTitle: '',
        jobType: '',
        company: '',
        location: '',
        description: '',
        qualifications: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return (<>
        <Header />
        <div className="create-internship-container">
            <form className="create-internship-form" onSubmit={handleSubmit}>
                <h2>Create New Internship</h2>
                <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required />
                <input type="text" name="jobType" placeholder="Job Type" value={formData.jobType} onChange={handleChange} required />
                <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
                <textarea name="qualifications" placeholder="Qualifications" value={formData.qualifications} onChange={handleChange} required></textarea>
                <button type="submit">Create</button>
            </form>
        </div>
    </>
    );
};

export default CreateInternship;
