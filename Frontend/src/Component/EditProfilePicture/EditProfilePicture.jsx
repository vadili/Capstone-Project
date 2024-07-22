import React, { useState } from 'react';

const EditProfilePicture = ({ currentPicture, onSave }) => {
    const [preview, setPreview] = useState(currentPicture);
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

    return (
        <div className="edit-profile-picture">
            <div>
                {(preview && preview.length > 1) ? (
                    <img src={preview.includes('uploads') ? `http://localhost:3001/${preview}` : preview} alt="Profile Preview" className="profile-preview" />
                ) : (
                    <i className="fa-solid fa-user icon profile-icon"></i>
                )}
            </div>
            <input className='fileUploader' type="file" accept="image/*" onChange={(e) => { onSave(e); handleFileChange(e) }} />

        </div>
    );
};

export default EditProfilePicture;
