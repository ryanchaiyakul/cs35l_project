import React, { useEffect, useState } from 'react';
import axios from "axios";

export default function SpotifyGetPlaylists() {
    const [token, setToken] = useState("");
    const [data, setData] = useState({});

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



    const handleGetPlaylists = () => {
        axios.get("")
    }

    return (
        <button>Get Playlists</button>
    );
}
