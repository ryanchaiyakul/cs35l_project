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

function AudioBlock({title}) {
    // a custom hook to handle audio
    const useAudio = (url) => {
        const [audio] = useState(new Audio(url));
        const [playing, setPlaying] = useState(false);
        const [volume, setVolume] = useState(50);
    
        const togglePlayback = () => setPlaying(!playing);
    
        useEffect(() => {
            if (playing) {
                audio.play();
            }
            else {
                audio.pause();
            }
        }, [playing]);
    
        useEffect(() => {
            audio.addEventListener('ended', () => setPlaying(false));
            return () => {
                audio.removeEventListener('ended', () => setPlaying(false));
            };
        }, []);

        useEffect(() => {
            audio.volume = volume / 100;
        }, [volume]);

        // var slider = document.getElementById("volumeSlider");
        // var volume;
        // slider.oninput = function() {
        //     volume = this.value;
        // }
        // audio.volume(volume/100)
    
        return [playing, togglePlayback, volume, setVolume];
    };
    
    const [playing, togglePlayback, volume, setVolume] = useAudio(`http://localhost:4000/_get_audio_data?title=${title}`);

    const AudioPlayer = ({ playing, togglePlayback, volume, setVolume }) => {
        
    
        window.onload = init;

        function init(){
            var slider = document.getElementById("volumeSlider");

            slider.oninput = function() {
                console.log(this.value);
                setVolume(this.value);
            }
        }

        return (
            <div>
                 <button onClick={togglePlayback}>
                    {playing ? '☼' : '☀'}
                </button>
                <input type='range' min={0} max={100} value={50} className='slider' id='volumeSlider'/>
            </div>
        );
    };

    return (
        <div>
            <AudioPlayer playing={playing} togglePlayback={togglePlayback} volume={volume} setVolume={setVolume}/>
        </div>
    );
}

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
function AudioPlayback({playlist, removeSong}) {
    return (
        <div>
            {playlist.map(song => (
            <PlaylistItem key={song.title}>
                <SongTitle>{song.title}</SongTitle>
                <AudioBlock title={song.title}/>
                {/* <input type='range' min={0} max={100} value={50} className='slider' id='volumeSlider'></input> */}
                <RemoveFromPlaylistButton onClick={() => removeSong(song)}>x</RemoveFromPlaylistButton>
            </PlaylistItem>
        ))}
        </div>
    );
}

export default AudioPlayback;