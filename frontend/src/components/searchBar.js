import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import AudioPlayback from './AudioPlayback';

const Container = styled.div`
  background-color: #191414;
  color: #fff;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 80%;
  border-radius: 4px;
  border: none;
  background-color: #282828;
  color: #fff;
  margin-bottom: 10px;
`;

const TagsContainer = styled.div`
  margin-bottom: 10px;
`;

const TagButton = styled.button`
  background-color: ${({ active }) => (active ? '#167344' : '#69B38E')};
  color: #fff;
  padding: 5px 10px;
  margin: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: grey;
  }
`;

const ClearButton = styled.button`
  background-color: grey;
  color: #fff;
  padding: 5px 10px;
  margin: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #B3B6B4;
  }
`;

const SongContainer = styled.div`
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

const AddToPlaylistButton = styled.button`
  background-color: #1db1ff;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

`;

const PlaylistContainer = styled.div`
  margin-top: 20px;
`;

const PlaylistTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const PlaylistItem = styled.div`
  background-color: #282828;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export default function SearchBar({ playlist, handlePlaylist, removeSong }) {
  const [songs, setSongs] = useState([]);

  // fetch list of audios and their metadata
  useEffect(() => {
    const fetchAudioMetadata = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/_get_audio_metadata`);
        const songs = response.data;
        setSongs(songs);
      } catch (error) {
        console.error('Error fetching audio metadata:', error);
      }
    };
    fetchAudioMetadata();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // event handlers
  function handleSearchQueryChange(event) {
    setSearchQuery(event.target.value);
  }

  function handleTagClick(tag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  function handleClearTags() {
    setSelectedTags([]);
  }

  const filteredSongs = songs.filter(song => {
    if (selectedTags.length === 0 || selectedTags.includes(song.tag)) {
      return song.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });

  // hardcoded tags
  const uniqueTags = ['animals', 'people', 'white noise', 'weather'];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function handleSearchBarClick() {
    if (!isMenuOpen) {
      setTimeout(() => {
        toggleMenu();
      }, 0);
    }
  }
  
  useEffect(() => {
    function handleOutsideClick(event) {
      const menuContainer = document.getElementById('menu-container');
      if (isMenuOpen && !menuContainer.contains(event.target)) {
        toggleMenu();
      }
    }
  
    window.addEventListener('mousedown', handleOutsideClick);
  
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);  

  return (
    <Container>
      <Title>Search</Title>
      <SearchInput type="text" value={searchQuery} onChange={handleSearchQueryChange} onClick={handleSearchBarClick} />
      {isMenuOpen && (
        <div id="menu-container">
          <TagsContainer>
            <p>Tags:</p>
            {uniqueTags.map(tag => (
              <TagButton 
                key={tag} 
                onClick={() => handleTagClick(tag)}
                active={selectedTags.includes(tag)}
              >
                {tag}
              </TagButton>
            ))}
            <ClearButton onClick={handleClearTags}>clear all</ClearButton>
          </TagsContainer>
          {filteredSongs.map(song => (
            <SongContainer key={song.title}>
              <SongTitle>{song.title}</SongTitle>
              <AddToPlaylistButton onClick={() => handlePlaylist(song)}>+</AddToPlaylistButton>
            </SongContainer>
          ))}
        </div>
      )}


      
      
    </Container>
  );
}

/**
 * <PlaylistContainer>
        <PlaylistTitle>Playlist</PlaylistTitle>
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
            <RemoveFromPlaylistButton onClick={() => removeSong(song)}>x</RemoveFromPlaylistButton>
          </PlaylistItem>
        ))}
      </PlaylistContainer>
 */