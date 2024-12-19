import React, { useState } from 'react';

function DragDropUpload() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            uploadFileToBackend(files[0]);
        }
    };

    const handleFileSelect = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            uploadFileToBackend(files[0]);
        }
    };

    const uploadFileToBackend = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/cloud/upload', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the token here
                    },
                    body: formData

                });

                if (response.ok) {
                    const result = await response.text();
                    console.error(result);
                    setUploadStatus(`File uploaded successfully: ${result}`);
                } else {
                    setUploadStatus('Error uploading file');
                }
            } catch (error) {
                console.error('Error during file upload to backend:', error);
                setUploadStatus('Error during file upload to backend');
            }        } else {
            console.log("User is not logged in");
        }



    };

    return (
        <div
            style={{
                width: '100%',
                height: '200px',
                border: '2px dashed #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isDragging ? '#e0e0e0' : '#f9f9f9',
                color: '#666',
                fontSize: '18px',
                cursor: 'pointer',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
        >
            {isDragging ? 'Drop files here...' : 'Drag files here or click to upload'}
            <input
                id="fileInput"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />
            {uploadStatus && <div style={{ marginTop: '10px' }}>{uploadStatus}</div>}
        </div>
    );
}

export default DragDropUpload;
