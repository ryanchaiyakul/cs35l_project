import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import FileUpload from '../components/fileUpload.js';
import HamburgerMenu from '../components/hamburgerMenu';
import MyStats from './MyStats';
import SpotifyGetPlaylists from '../components/SpotifyGetPlaylists.js';
import { Link } from 'react-router-dom';
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
  height: 30%;
  background-color: #191414;
  padding: 10px;
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
  padding: 20px;
  background: linear-gradient(to bottom, #6BACBA 50%, #398393 65%); /* Gradient background */
  border-radius: 8px;
  width: 18%;
  height: 50%;
  top: 20%;
  left: 5%;
  overflow: auto; /* Enable scrolling when content exceeds container height */
`;

const PlaylistTitle = styled.div`
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
`;

function HomeScreen() {
    const [isOpen, setIsOpen] = useState(false);
    const [mainPlaylist, setPlaylist] = useState([]);
    const [addedToPlaylist, setAddedToPlaylist] = useState(false); 

    useEffect(() => {
      if (addedToPlaylist) {
        setTimeout(() => {
          setAddedToPlaylist(false);
        }, 3000); // Clear the "Added to playlist!" message after 3 seconds
      }
    }, [addedToPlaylist]);

    function handlePlaylist(song) {
      if (!mainPlaylist.includes(song)) {
        setPlaylist([...mainPlaylist, song]);
      }
      setAddedToPlaylist(true);
    }
  
    function removeSong(removedSong) {
      const newPlaylist = mainPlaylist.filter(song => song !== removedSong);
      setPlaylist(newPlaylist);
    }

    const handleClick = () => {
        setIsOpen(!isOpen);
      };

  return (
    <Container>
      <HamburgerMenu mainPlaylist={mainPlaylist} handlePlaylist={handlePlaylist} addedToPlaylist={addedToPlaylist}/>
      <Title>My Terrarium</Title>
      <ImageContainer>
        <Image src="https://i.pinimg.com/originals/96/4c/82/964c82250ef9951e3309b8e36d2bf9b9.gif" alt="Terrarium" />
      </ImageContainer>
      <Message>Image by <Hyperlink href="https://mini-moss.tumblr.com/about">Mini Moss</Hyperlink></Message>
      <AudioContainer>
        <PlaylistTitle> My Audios </PlaylistTitle>
        <AudioPlayback playlist={mainPlaylist} removeSong={removeSong}/>
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

export default HomeScreen;
