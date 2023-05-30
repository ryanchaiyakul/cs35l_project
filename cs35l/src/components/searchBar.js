import React, {useEffect, useState} from 'react';
import axios from 'axios';

// const songs = [
//   {
//     title: 'OMG',
//     author: 'New Jeans',
//     tag: 'Kpop',
//   },
//   {
//     title: 'Up!',
//     author: 'Kep1er',
//     tag: 'Kpop',
//   },
// {
//   title: 'So Good',
//   author: 'Weston Estate',
//   tag: 'Indie',
// },
// {
//   title: 'Calone',
//   author: 'Tiffany Day',
//   tag: 'Indie',
// },
// {
//   title: 'Racing through the Night',
//   author: 'Yoasobi',
//   tag: 'Jpop',
// },
// ]


export default function SearchBar() {
  const [songs, setSongs] = useState([]);

  // fetch list of audios and their metadata
  useEffect(() => {
    const fetchAudioMetadata = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/_get_audio_metadata`);
        const {songs} = response.data;
        setSongs(songs);
      } catch (error) {
        console.error('Error fetching audio metadata:', error);
      }
    };
    fetchAudioMetadata();
  }, []);
  console.log(songs);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  // event handler
  function handleSearchQueryChange(event) {
    setSearchQuery(event.target.value);
  }

  function handleTagClick(tag){
    setSelectedTags([...selectedTags, tag]);
  }

  function handlePlaylist(song) {
    if(!playlist.includes(song)){
      setPlaylist([...playlist, song]);
    }
  }

  function removeSong(removedSong) {
    const newPlaylist = playlist.filter(song => song !== removedSong);
    setPlaylist(newPlaylist);
  }

  const filteredSongs = songs.filter(song => {
    if (selectedTags.length === 0 || selectedTags.includes(song.tag)) {
      return song.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });  

  // get a list of unique tags for rendering the tag buttons
  const uniqueTags = [...new Set(songs.map(song => song.tag))];

  return (
    <div>
      <h1>Search</h1>
      <input type="text" value={searchQuery} onChange={handleSearchQueryChange} />
      <p> Tags: </p>
      {uniqueTags.map(tag => (
        <button key={tag} onClick={() => handleTagClick(tag)}>{tag}</button>
      ))}
      <button onClick={() => setSelectedTags([])}>Clear Tags</button>

      {filteredSongs.map(song => (
        <div key={song.title}>
          <p>{song.title}</p>
          <button onClick={() => handlePlaylist(song)}> + </button>
          </div>
      ))}
      <h2>Playlist</h2>
      <ul>
        {playlist.map(song => (
          <div key={song.title}>
          <li>{song.title}</li>
          <button onClick={() =>removeSong(song)}> x </button>
          </div>
        ))}
      </ul>
    </div>
  );
}
