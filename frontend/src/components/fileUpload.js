import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #191414;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 10px;
  font-size: 16px;
`;

const StyledInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 50%;
  color: black;
`;

const UploadFileButton = styled.input`
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`;


const StyledSelect = styled.select`
  padding: 10px;
  margin-bottom: 10px;
  width: 50%;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #69B38E;
  color: white;
  border: none;
  cursor: pointer;
`;

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [userId, setUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
   // Retrieve the user ID from cookies when the component mounts
   useEffect(() => {
    const id = getCookie();
    setUserId(id);
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTagChange = (event) => {
    setTag(event.target.value);
  };


  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile || !title || !tag) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (!userId) {
      setErrorMessage('You must log in to Spotify first');
      return;
    }

    setErrorMessage('');

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', title);
    formData.append('tag', tag);
    formData.append('owner_id', userId);

    try {
      const response = await fetch('http://localhost:4000/_upload_audio', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('File upload successful');
      } else {
        if (response.status === 502) {
          setErrorMessage('A file with that same title has already been uploaded');
        } else {
          console.log('File upload failed');
        }
      }
    } catch (error) {
      console.log('An error occurred during file upload:', error);
    }
  };

  console.log(userId);

  return (
    <Container>
      <Form method="post" encType="multipart/form-data" onSubmit={handleFormSubmit}>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <UploadFileButton placeholder="file" type="file" name="audio_file" accept="Audio/mp3" onChange={handleFileChange} />
        <input type="hidden" value={userId} name="owner_id"/>
        <StyledInput placeholder="Title" type="text" name="title" value={title} onChange={handleTitleChange} />
        <StyledSelect name="tag" value={tag} onChange={handleTagChange}>
          <option value="">Select a tag</option>
          <option value="animals">Animals</option>
          <option value="people talking">People Talking</option>
          <option value="white noise">White Noise</option>
          <option value="weather">Weather</option>
        </StyledSelect>
        <StyledButton type="submit">Upload</StyledButton>
      </Form>
    </Container>
  );
}

export default FileUpload;
