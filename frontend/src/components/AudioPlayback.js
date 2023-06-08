import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

const PlaylistItem = styled.div`
  background-color: #282828;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SongTitle = styled.p`
  color: #fff;
  font-size: 16px;
  margin-bottom: 5px;
`;

/**
 * Returns HTML Audio Elements for every song in the passed in playlist prop
 * 
 * The prop should be directly from the backend in dictionary format
 * 
 * TODO: 
 * 
 * Integrate play and volume control with HTMLMediaElement API
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 * 
 * Style the output
 * 
 * Get it to run (debug backend)
 */
function AudioPlayback({playlist}) {
    return (
        <div>
            {playlist.map(song => (
            <PlaylistItem key={song.title}>
                <SongTitle>{song.title}</SongTitle>
                <audio
                    controls
                    src={`http://localhost:4000/_get_audio_data?title=${song.title}`}>
                        <a href={`http://localhost:4000/_get_audio_data?title=${song.title}`}>
                            Download audio
                        </a>
                </audio>
            </PlaylistItem>
        ))}
        </div>
    );
}

export default AudioPlayback;