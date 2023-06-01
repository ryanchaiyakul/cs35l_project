import React, { useEffect, useState } from 'react';
// import Select from 'react-select';
import axios from "axios";

function SpotifyEmbed({playlistID}) { 
/*

create a spotify embed with the provided playlistID 

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${playlistID}?utm_source=generator" 
width="25%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; 
picture-in-picture" loading="lazy"></iframe>

*/

return (
    <div style={{borderRadius:'12px'}}>
        <iframe src="https://open.spotify.com/embed/playlist/5hJ57gswRAZpEdE35qKVkt?utm_source=generator" width="25%" height="352" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    </div>
    );

}



function ScrollingPlaylistMenu({playlists}) {
    if (playlists = {}) {
        // handle no playlists case (give a playlist of recommendations?)
        return ( 
            <> 
                <p>no playlists found</p>
            </>
        );
    } else {
        return
    }


}

// first entry: default playlist + change playlists button (user_id from useEffect, if no user_id, clicking change playlist will redirect)
//         - playlists will be fetched in useEffect if user_id is not empty string
// click change playlists button replaces embed with list of playlist names, from which user can select a playlist
// collects playlist id, and replaces SpotifyEmbed id with new embed

export default function SpotifyGetPlaylists() {
    const [playlistData, setPlaylistData] = useState({});
    const [fetchedPlaylists, setFetchedPlaylists] = useState(false);
    const [userID, setUserID] = useState('');

    const [choosingNewPlaylist, setChoosingNewPlaylist] = useState(false);
    const [currPlaylistID, setCurrPlaylistID] = useState('5hJ57gswRAZpEdE35qKVkt');

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

    const handleGetPlaylists = async () => {
        // if user_id = '', redirect to sign in
        try {
            console.log(userID);
            // const response = await axios.get('http://localhost:4000/_get_user_playlist_names', {params: {user_id: userID}});
            const response = await axios.get("http://localhost:4000/_get_embed_html");
            setFetchedPlaylists(true);
            const playlists = response.data;
            console.log(playlists)
            setPlaylistData(playlists);
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

    useEffect(() => {
        const user_id = getCookie();
        setUserID(user_id);
        console.log(user_id)
    }, []);
    
    if (!choosingNewPlaylist) {
        return (
            <>
                <button onClick={handleGetPlaylists}>Change Playlist</button>
                <SpotifyEmbed playlistID={currPlaylistID}/>
            </>
        );
    } else {
        
    }
    
}
