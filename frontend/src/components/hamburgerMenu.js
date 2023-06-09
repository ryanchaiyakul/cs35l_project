import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import SearchBar from '../components/searchBar';

const MenuIcon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 60px;
  height: 45px;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 999;
  overflow: auto;
`;

const HamburgerLine = styled.div`
  width: 100%;
  height: 8px;
  background-color: #333;
  transition: transform 0.3s ease;

  ${(props) =>
    props.open &&
    css`
      &:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg) translate(8px, -8px);
      }
    `}
  
  ${(props) =>
    props.open &&
    css`
      background-color: #fff;
    `}
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 25%;
  height: 100vh;
  background-color: #191414;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 998;
  overflow: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
`;

const HamburgerMenu = ({mainPlaylist, handlePlaylist, addedToPlaylist}) => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleMenuClick = () => {
    setPopupOpen(!isPopupOpen);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div>
      <MenuIcon onClick={handleMenuClick}>
        <HamburgerLine open={isPopupOpen} />
        <HamburgerLine open={isPopupOpen} />
        <HamburgerLine open={isPopupOpen} />
      </MenuIcon>

      {isPopupOpen && (
        <Popup>
          <CloseButton onClick={closePopup}>Close</CloseButton>
          <SearchBar playlist={mainPlaylist} handlePlaylist={handlePlaylist} addedToPlaylist={addedToPlaylist}/>
        </Popup>
      )}
    </div>
  );
};

export default HamburgerMenu;