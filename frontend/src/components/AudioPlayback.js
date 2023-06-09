import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

const PlaylistItem = styled.div`
  background-color: transparent;
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
  vertical-align: middle;
`;

const RemoveFromPlaylistButton = styled.button`
  background-color: transparent;
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
        audio.id = `song_${title}`;
        const [playing, setPlaying] = useState(false);
    
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
    
        window.addEventListener("DOMContentLoaded", (event) => { 
          var volumeSlider = document.getElementById('volumeSlider')
          volumeSlider.addEventListener("change", function() {
            document.getElementById(audio.id).volume = volumeSlider.value / 100;
          }, false);
        });

        return [playing, togglePlayback];
    };
    
    const AudioPlayer = ({ url }) => {
        const [playing, togglePlayback] = useAudio(url);
    
        return (
            <div>
                 <button onClick={togglePlayback} style={{backgroundColor:'#63ad77', color:'white', height:'30px', width:'30px', borderRadius:'4px', border:'none', textAlign:'center'}}>
                    {playing ? '☼' : '☀'}
                </button>
                {/* <input type='range' min={0} max={100} value={50} className='slider' id='volumeSlider'></input> */}
            </div>
        );
    };

    return (
        <div>
            <AudioPlayer url={`http://localhost:4000/_get_audio_data?title=${title}`}/>
        </div>
    );
}

function updateSlider(sliderVal, title) 
{
  const audio_id = `song_${title}`;
  var volumeSlider = document.getElementById('volumeSlider')
  volumeSlider.addEventListener("change", function() {
    document.getElementById(audio_id).volume = volumeSlider.value / 100;
  });
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
                <SongTitle>{song.title}     </SongTitle>
                <AudioBlock title={song.title}/>
                {/* <script> 
                  function updateSlider(slideAmount) {
                    // let volumeSlider = document.getElementById("volumeSlider");
                    var audio_id = `song_${song.title}`;
                    var audio = document.getElementById(audio_id).volume(slideAmount);
                  }
                </script> */}
                {/* <input type="range" min="0" max="100" value="50" class="slider" id="volumeSlider"></input> */}
                {/* <input type='range' min={0} max={100} value={50} className='slider' id='volumeSlider' onChange={()=> updateSlider(this.value, song.title)}></input> */}
                <RemoveFromPlaylistButton onClick={() => removeSong(song)}>x</RemoveFromPlaylistButton>
            </PlaylistItem>
        ))}
          
        </div>
    );
}

export default AudioPlayback;