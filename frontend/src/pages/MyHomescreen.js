import React, {useState} from 'react';
import styled from 'styled-components';
import FileUpload from '../components/fileUpload.js';
import HamburgerMenu from '../components/hamburgerMenu';
import MyStats from './MyStats';
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

const BottomRightContainer = styled.div`
  position: absolute;
  bottom: 50px;
  right: 50px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const Button = styled.button`
  font-size: 36px;
  color: black;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  font-size: 38px;
  margin-right: 50px; 
  color: black;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
`;

const HamburgerMenuButton = styled.button`
  display: ${({ isOpen }) => (isOpen ? 'none' : 'block')};
  font-size: 36px;
  color: black;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const HamburgerMenuContainer = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  bottom: 0;
  right: 0;
  width: 20%;
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


function HomeScreen() {
    const [isOpen, setIsOpen] = useState(false);
    const [mainPlaylist, setPlaylist] = useState([]);

    const handleClick = () => {
        setIsOpen(!isOpen);
      };

  return (
    <Container>
      <HamburgerMenu mainPlaylist={mainPlaylist} setPlaylist={setPlaylist}/>
      <Title>My Terrarium</Title>
      <ImageContainer>
        <Image src="https://i.pinimg.com/originals/96/4c/82/964c82250ef9951e3309b8e36d2bf9b9.gif" alt="Terrarium" />
      </ImageContainer>
      <Message>Image by <Hyperlink href="https://mini-moss.tumblr.com/about">Mini Moss</Hyperlink></Message>
      <AudioPlayback playlist={mainPlaylist}/>
      <BottomRightContainer>
        <StyledLink to="/mystats">MyStats</StyledLink>
        <HamburgerMenuButton isOpen={isOpen} onClick={handleClick}>
        Upload
      </HamburgerMenuButton>
      <HamburgerMenuContainer isOpen={isOpen}>
        <CloseButton onClick={handleClick}>X</CloseButton>
        <FileUpload />
      </HamburgerMenuContainer>
      </BottomRightContainer>
    </Container>
  );
}

export default HomeScreen;
