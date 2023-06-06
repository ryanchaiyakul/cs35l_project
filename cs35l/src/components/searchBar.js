import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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

const HamburgerMenu = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const HamburgerIcon = styled.div`
  width: 20px;
  height: 2px;
  background-color: #fff;
  margin-right: 5px;
`;

const HamburgerText = styled.p`
  color: #fff;
  font-size: 16px;
  margin: 0;
  cursor: pointer;
`;

const SearchInput = styled.input`
  padding: 10px;
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
  background-color: #1db1ff;
  color: #fff;
  padding: 5px 10px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #1ed760;
  }
`;

const ClearTagsButton = styled.button`
  background-color: #1db1ff;
  color: #fff;
  padding: 5px 10px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #1ed760;
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

  &:hover {
    background-color: #0099e6;
  }
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
  background-color: #1db954;
  color: #fff;
  padding: 5px 10px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #1ed760;
  }
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
    setSelectedTags([...selectedTags, tag]);
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

  // get a list of unique tags for rendering the tag buttons
  const uniqueTags = [...new Set(songs.map(song => song.tag))];
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
              <TagButton key={tag} onClick={() => handleTagClick(tag)}>
                {tag}
              </TagButton>
            ))}
            <ClearTagsButton onClick={handleClearTags}>Clear Tags</ClearTagsButton>
          </TagsContainer>
          {filteredSongs.map(song => (
            <SongContainer key={song.title}>
              <SongTitle>{song.title}</SongTitle>
              <AddToPlaylistButton onClick={() => handlePlaylist(song)}>+</AddToPlaylistButton>
            </SongContainer>
          ))}
        </div>
      )}

      <PlaylistContainer>
        <PlaylistTitle>Playlist</PlaylistTitle>
        {playlist.map(song => (
          <PlaylistItem key={song.title}>
            <SongTitle>{song.title}</SongTitle>
            <RemoveFromPlaylistButton onClick={() => removeSong(song)}>x</RemoveFromPlaylistButton>
          </PlaylistItem>
        ))}
      </PlaylistContainer>
    </Container>
  );
}