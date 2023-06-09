import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

const PlaylistContainer = styled.div`
  background-color: transparent;
  padding: 10px;
  border-radius: 10px;
`;

const PlaylistItem = styled.div`
  background-color: #B8BFC1;
  padding: 5px 10px; /* Adjusted padding */
  margin-bottom: 5px; /* Adjusted margin */
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  height: 30px;
  width: 95%;
`;

const SongTitle = styled.p`
  color: #fff;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 17px;
  margin-right: 20px;
`;

const StyledAudio = styled.audio`
  height: 90%; /* Adjusted height */
  width: 90%; /* Adjusted width */
`;

function AudioPlayback({ playlist }) {
  return (
    <PlaylistContainer>
      {playlist.map((song) => (
        <PlaylistItem key={song.title}>
          <SongTitle>{song.title}</SongTitle>
          <StyledAudio
            controls
            loop
            src={`http://localhost:4000/_get_audio_data?title=${song.title}`}
          >
            <a href={`http://localhost:4000/_get_audio_data?title=${song.title}`}>
              Download audio
            </a>
          </StyledAudio>
        </PlaylistItem>
      ))}
    </PlaylistContainer>
  );
}

export default AudioPlayback;
