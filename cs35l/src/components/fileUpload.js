import React, { useState, useEffect } from 'react';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [userId, setUserId] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTagChange = (event) => {
    setTag(event.target.value);
  };

  const getCookie = () => {
    const cookieArray = document.cookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      const [key, value] = cookieArray[i].split('=');

      if (key.trim() === 'user_id') {
        return value;
      }
    }

    return '';
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', title);
    formData.append('tag', tag);
    formData.append('owner_id', userId);

    try {
      const response = await fetch('/_upload_audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File upload successful');
        // Handle the response from the server
      } else {
        console.log('File upload failed');
        // Handle the response from the server in case of failure
      }
    } catch (error) {
      console.log('An error occurred during file upload:', error);
      // Handle any errors that occurred during the request
    }
  };

  // Retrieve the user ID from cookies when the component mounts
  useEffect(() => {
    const id = getCookie();
    setUserId(id);
  }, []);

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input type="text" placeholder="Title" value={title} onChange={handleTitleChange} />
        <input type="text" placeholder="Tag" value={tag} onChange={handleTagChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUpload;