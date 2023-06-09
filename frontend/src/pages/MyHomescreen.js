import styled from 'styled-components';
import FileUpload from '../components/fileUpload.js';
import HamburgerMenu from '../components/hamburgerMenu';
import SpotifyGetPlaylists from '../components/SpotifyGetPlaylists.js';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback} from 'react';
import AudioPlayback from '../components/AudioPlayback.js';

const Container = styled.div`
  background-color: #A7D2BD;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  position: relative;
`;

const Title = styled.h1`
  font-size: 56px;
  text-align: center;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  width: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 100%;
`;

const Message = styled.p`
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
`;

const Hyperlink = styled.a`
  color: #000000;
  text-decoration: underline;
`;

const TopLeftContainer = styled.div`
  font-size: 20px;
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const ButtonLink = styled.a`
  display: block;
  width: inherit;
  height: 25px;
  background: #4E9CAF;
  padding: 4px;
  margin: 8px 2px;
  border-radius: 4px;
  text-align: center;
  color: white;
  line-height: 25px;
`;

const StyledLink = styled(Link)`
  padding: 1px 6px;
  margin-right: 20px; 
  color: black;
  underline: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
`;
const StyledA = styled.a`
padding: 1px 6px;
margin-right: 20px; 
color: black;
underline: none;
background-color: transparent;
border: none;
cursor: pointer;
text-decoration: none;
`;
const HamburgerMenuButton = styled.button`
  display: ${({ isOpen }) => (isOpen ? 'none' : 'block')};
  font-size: 20px;
  color: black;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const HamburgerMenuContainer = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 30%;
  height: 25%;
  background-color: #191414;
  padding: 40px;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color:white;
`;

const SpotifyEmbedContainer = styled.div`
  position: absolute;
  border: none;
  max-width: 300px;
  top: 20%;
  right: 5%;
`;

const AudioContainer = styled.div`
  position: absolute;
  border: none;
  max-width: 300px;
  top: 20%;
  left: 5%;
`;

const RemoveFromPlaylistButton = styled.button`
  background-color: #1db1ff;
  color: #fff;
  padding: 5px 10px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
`;


function HomeScreen() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

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

  useEffect(() => {
    const id = getCookie();
    setUserId(id);
  }, []);

  console.log(userId);

  const checkLoginStatus = useCallback(async () => {
    const id = getCookie();
    setUserId(id);

    if (id === null || id === '') {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    // Redirect the user to Spotify login page
    window.location.href = 'http://localhost:4000/connect';
  };

  useEffect(() => {
    const intervalId = setInterval(checkLoginStatus, 5000); // Check login status every 5 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [checkLoginStatus]);

  useEffect(() => {
    checkLoginStatus(); // Check initial login status
  }, [checkLoginStatus]);

    const [isOpen, setIsOpen] = useState(false);
    const [mainPlaylist, setPlaylist] = useState([]);

    function handlePlaylist(song) {
      if (!mainPlaylist.includes(song)) {
        setPlaylist([...mainPlaylist, song]);
      }
    }
  
    function removeSong(removedSong) {
      const newPlaylist = mainPlaylist.filter(song => song !== removedSong);
      setPlaylist(newPlaylist);
    }

    const handleClick = () => {
        setIsOpen(!isOpen);
      };

  if (!isLoggedIn) {
        return (
          <div>
            <h1>You must log in</h1>
            <button onClick={handleLogin}>Login with Spotify</button>
          </div>
        );
  }else {
  return (
    <Container>
      <HamburgerMenu mainPlaylist={mainPlaylist} handlePlaylist={handlePlaylist} removeSong={removeSong}/>
      <Title>My Terrarium</Title>
      <ImageContainer>
        <Image src="https://i.pinimg.com/originals/96/4c/82/964c82250ef9951e3309b8e36d2bf9b9.gif" alt="Terrarium" />
      </ImageContainer>
      <Message>Image by <Hyperlink href="https://mini-moss.tumblr.com/about">Mini Moss</Hyperlink></Message>
      <AudioContainer>
        <AudioPlayback playlist={mainPlaylist}/>
      </AudioContainer>
      <SpotifyEmbedContainer>
        <ButtonLink><a href="/connect" style={{textDecoration: 'inherit', color: 'inherit'}}>Connect To Spotify</a></ButtonLink>
        <SpotifyGetPlaylists/>
      </SpotifyEmbedContainer>
      <TopLeftContainer>
        <StyledLink to="/mystats">My Stats</StyledLink>
        <StyledA><a href="/liked" style={{textDecoration: 'none', color: 'inherit'}}>Liked Tracks</a></StyledA>

        <HamburgerMenuButton isOpen={isOpen} onClick={handleClick}>
        Upload
      </HamburgerMenuButton>
      <HamburgerMenuContainer isOpen={isOpen}>
        <CloseButton onClick={handleClick}>X</CloseButton>
        <FileUpload />
      </HamburgerMenuContainer>
      </TopLeftContainer>
    </Container>
  );
}
}

export default HomeScreen;
