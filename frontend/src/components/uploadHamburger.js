import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from './fileUpload';

const HamburgerMenuButton = styled.button`
  position: fixed;
  bottom: ${({ isOpen }) => (isOpen ? '-50px' : '20px')};
  display: ${({ isOpen }) => (isOpen ? 'none' : 'block')};
  font-size: 36px;
  color: black;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const Button = styled.button`
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
  width: 40%;
  height: 25%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;

const UploadHamburger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <HamburgerMenuButton isOpen={isOpen} onClick={handleClick}>
        Upload
      </HamburgerMenuButton>
      <HamburgerMenuContainer isOpen={isOpen}>
        <CloseButton onClick={handleClick}>X</CloseButton>
        <FileUpload />
      </HamburgerMenuContainer>
    </div>
  );
};

export default UploadHamburger;
