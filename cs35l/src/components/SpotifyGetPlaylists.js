import React, { useEffect, useState } from 'react';
// import Select from 'react-select';
import axios from "axios";

function SpotifyEmbed({playlistID}) { 
/*
create a spotify embed with the provided playlistID 

<iframe style="border-radius:12px" src={"https://open.spotify.com/embed/playlist/${playlistID}?utm_source=generator"}
width="25%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; 
picture-in-picture" loading="lazy"></iframe>
*/

return (
    <div style={{borderRadius:'12px'}}>
        <iframe src={`https://open.spotify.com/embed/playlist/${playlistID}?utm_source=generator`} width="25%" height="352" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    </div>
    );

}

// first entry: default playlist + change playlists button (user_id from useEffect, if no user_id, clicking change playlist will redirect)
//         - playlists will be fetched in useEffect if user_id is not empty string
// click change playlists button replaces embed with list of playlist names, from which user can select a playlist
// collects playlist id, and replaces SpotifyEmbed id with new embed

export default function SpotifyGetPlaylists() {
    const [playlistData, setPlaylistData] = useState([]);
    const [fetchedPlaylists, setFetchedPlaylists] = useState(false);
    const [userID, setUserID] = useState('');

    const [choosingNewPlaylist, setChoosingNewPlaylist] = useState(false);
    const [currPlaylistID, setCurrPlaylistID] = useState('5diLKJriPFCawvoY9YRFKC');

    const getCookie = () => {
        const cookieArray = document.cookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            const [key, value] = cookieArray[i].split('=');
        
            if (key.trim() === 'user_id') {
                return value;
            }
        }
        
        return '';
    };

    async function getPlaylists(user_id) {
        // if user_id = '', redirect to sign in
        try {
            const response = await axios.get('http://localhost:4000/_get_user_playlist_names', {params: {user_id: user_id}});
            setFetchedPlaylists(true);
            const playlists = response.data;

            var parsedPlaylists = []
            for (const playlist in playlists) {
                var singleplaylist = {}
                singleplaylist['id'] = playlist
                singleplaylist['name'] = playlists[playlist]
                parsedPlaylists.push(singleplaylist)
            }

            console.log(parsedPlaylists);
            setPlaylistData(parsedPlaylists);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request)
            {
                console.log(error.request);
            }
        }
    }

    const handleOptionChange = (event) => {        
        setCurrPlaylistID(event.target.value);
        setChoosingNewPlaylist(false);
    };

    function ScrollingPlaylistMenu() {
        console.log("scrollingmenu called")
        if (playlistData === {} || !fetchedPlaylists) {
            // handle no playlists case (give a playlist of recommendations?)
            const FetchedPlaylistsMessage = "you must be logged in to spotify to see your playlists!"
            const EmptyPlaylistDataMessage  = "you have no playlists! get a playlists of recommendations at PAGE_TBD"
            return (
                <>
                    <div>
                        {fetchedPlaylists ? EmptyPlaylistDataMessage : FetchedPlaylistsMessage}
                        <button onClick={() => setChoosingNewPlaylist(false)}>OK!</button>
                    </div>
                </>
            ); 
        } else {
            var currentPlaylist =  ''
            playlistData.forEach((playlist) => {
                if (playlist['id'] == currPlaylistID)
                {
                    currentPlaylist = playlist['name']
                }
            });

            console.log(currentPlaylist)
            return (
                <div>
                    <select value={currPlaylistID} onChange={handleOptionChange} id='playlistsDropdown'>
                        {playlistData.map((playlist) => (
                        <option value={playlist['id']} key={playlist['name']}>
                            {playlist['name']}
                        </option>
                        ))}
                    </select>
                    <p>currently playing from: {currentPlaylist}</p>
                </div>
            )
        }
    }

    useEffect(() => {
        const user_id = getCookie();
        setUserID(user_id);
        if (user_id !== '') {
            getPlaylists(user_id);
        }
    }, []);
    
    if (userID === '') {
        console.log('no userID')
    }

    return (
        <div>
            <button onClick={() => setChoosingNewPlaylist(true)} id='changePlaylistButton'>Change Playlist</button>
            {choosingNewPlaylist ? <ScrollingPlaylistMenu/> : null} 
            <SpotifyEmbed playlistID={currPlaylistID}/>
        </div>
    );
    
}
