import React, { useState } from 'react';

const EditProfilePicture = ({ currentPicture, onSave }) => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3001/api/user/profile-picture', {
                    method: 'PUT',
                    headers: {
                        'Authorization': token,
                    },
                    body: formData,
                });

                if (response.ok) {
                    onSave(preview);
                } else {
                    console.error('Error updating profile picture');
                }
            } catch (error) {
                console.error('Error updating profile picture', error);
            }
        }
    };

    return (
        <div className="edit-profile-picture">
            <div>
                <img src={preview ? preview : `http://localhost:3001/${currentPicture}`} alt="Profile Preview" className="profile-preview" />
            </div>
            <input className='fileUploader' type="file" accept="image/*" onChange={(e) => { onSave(e); handleFileChange(e) }} />

        </div>
    );
};

export default EditProfilePicture;
