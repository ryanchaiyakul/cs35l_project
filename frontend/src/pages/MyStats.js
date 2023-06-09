import '../css/MyStats.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
//Easy scrollable
import Header from "../components/header";


//pass user_id as a query param into the get request 

//Fetch (url) localhost://4000
//method: GET


//Function to get the user_id for the cookie. (Find which user's statistics to show)
// function getCookie() {
//     var key, value, i;
//     var cookieArray = document.cookie.split(';');
//     for (i = 0; i < cookieArray.length; i++) {
//         key = cookieArray[i].slice(0, cookieArray[i].indexOf("="));
//         value = cookieArray[i].slice(cookieArray[i].indexOf("=") + 1);
//         if (key == 'user_id') {
//             console.log("KEY: " + value)
//             return value;
//         }
//     }
//     return ''
// }

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


function getURL(data) {
    console.log("RUNNING FUNCTION");
    // URL = data.track.external_urls;
    URL = "LJSDF";

    return URL;
}

function login() {
    window.location.assign("http://localhost:4000/connect")
};

//Fetch data
//Equivalent to http://localhost:4000/_get_user_stats?user_id=getCookie()
async function fetchData() {
    var recentlyPlayed = [];
    var response = await axios.get(`http://localhost:4000/_get_user_stats`, { params: { user_id: getCookie() } });
    recentlyPlayed = response.data;
    console.log("Returning ", response.data);


    return response.data;

}



export default function MyStats() {
    //Render data before filling them in
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    //Render data to gather information
    useEffect(() => {
        // console.log("cookie : " + getCookie())
        // if (getCookie() === ''){
        //     login()
        // }
        async function check() {
            try {
                setLoading(true);
                const data = await fetchData();
                let fetchedData = await fetchData();

                setData(data);
                setLoading(false);
            }
            //Error
            catch (error) {
                setLoading(false);
                console.log("ERROR!", error);
                if (error.response.status == 404 || error.response.status == 400)
                {
                    login()
                }
            }
        }
        check();
    }, []);


    //Succesfully rendered all the data
    var recentlyPlayed = [];
    var recentlyPlayed_URL = [];


    var favorite_artists = [];
    var favorite_artists_URL = [];
    
    var favorite_track = [];
    var favorite_track_URL = [];
    
    if (!loading && data) {
        // console.log("Data received: ", data);


        //Get Recently Played List (After 40 characters, it will cut off (replace with ...))
        for (let i = 0; i < 9; i++) {
            if (i >= data.recent.length) {
                recentlyPlayed[i] = "Listen to more songs to add!";
                recentlyPlayed_URL[i] = "";
            }
            else {
                recentlyPlayed_URL[i] = data.recent[i].track.external_urls.spotify;

                if (data.recent[i].track.name.length > 40) {
                    recentlyPlayed[i] = data.recent[i].track.name.substring(0, 37) + "...";
                }
                else {
                    recentlyPlayed[i] = data.recent[i].track.name;
                }
            }
        }
        //Get favorite artists
        for (let i = 0; i < 9; i++) {
            if (i >= data.top_tracks.length) {
                favorite_track[i] = "";
                favorite_track_URL[i] = "";
            }
            else {
                favorite_track_URL[i] = data.top_tracks[i].external_urls.spotify;
                if (data.top_tracks[i].name.length > 40) {
                    favorite_track[i] = data.top_tracks[i].name.substring(0, 37) + "...";
                }
                else {
                    favorite_track[i] = data.top_tracks[i].name;
                    console.log("Top Tracks: ", i, + "" + data.top_tracks[0].name);
                }
            }
        }

        for (let i = 0; i < 9; i++) {
            if (i >= data.top_artists.length) {
                favorite_artists[i] = "";
                favorite_artists_URL[i] = "";
                
            }
            else {
                favorite_artists_URL[i] = data.top_artists[i].external_urls.spotify;
                if (data.top_artists[i].name.length > 40) {
                    favorite_artists[i] = data.top_artists[i].name.substring(0, 37) + "...";
                }
                else {
                    favorite_artists[i] = data.top_artists[i].name;
                    console.log("Artists: ", i, + "" + data.top_artists[0].name);
                }
            }
        }






        return (
            <div style={{ backgroundColor: '#A7D2BD', height: '360vh' }} className="App" >
                <Header />

                <div
                    style={{ color: '#ff6e40', fontSize: 20, top:'0px' }}
                    className="card" id="first">


                    {/* Title */}
                    <span className="font-link" id="firstTitle">
                        Recently Played
                    </span>

                    {/* Think about how many elements for each row */}
                    <span className="font-link" id="data_entry"> <a class="a" href={recentlyPlayed_URL[0]} style={{ textDecoration: 'none' }}> {recentlyPlayed[0]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recentlyPlayed_URL[1]} style={{ textDecoration: 'none' }}> {recentlyPlayed[1]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recentlyPlayed_URL[2]} style={{ textDecoration: 'none' }}> {recentlyPlayed[2]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recentlyPlayed_URL[3]} style={{ textDecoration: 'none' }}> {recentlyPlayed[3]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recentlyPlayed_URL[4]} style={{ textDecoration: 'none' }}> {recentlyPlayed[4]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recentlyPlayed_URL[5]} style={{ textDecoration: 'none' }}> {recentlyPlayed[5]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recentlyPlayed_URL[6]} style={{ textDecoration: 'none' }}> {recentlyPlayed[6]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recentlyPlayed_URL[7]} style={{ textDecoration: 'none' }}> {recentlyPlayed[7]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recentlyPlayed_URL[8]} style={{ textDecoration: 'none' }}> {recentlyPlayed[8]} </a></span>

                </div>


                {/* Second Column */}
                <div style={{ color: '#ff6e40', fontSize: 20 }}
                    className="card" id="second" >

                    <span className="font-link" id="secondTitle">
                        Favorite Artists
                    </span>

                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_artists_URL[0]} style={{ textDecoration: 'none' }}> {favorite_artists[0]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_artists_URL[1]} style={{ textDecoration: 'none' }}> {favorite_artists[1]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_artists_URL[2]} style={{ textDecoration: 'none' }}> {favorite_artists[2]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_artists_URL[3]} style={{ textDecoration: 'none' }}> {favorite_artists[3]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_artists_URL[4]} style={{ textDecoration: 'none' }}> {favorite_artists[4]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_artists_URL[5]} style={{ textDecoration: 'none' }}> {favorite_artists[5]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_artists_URL[6]} style={{ textDecoration: 'none' }}> {favorite_artists[6]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_artists_URL[7]} style={{ textDecoration: 'none' }}> {favorite_artists[7]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_artists_URL[8]} style={{ textDecoration: 'none' }}> {favorite_artists[8]} </a></span>
                </div>


                {/* Third Column */}
                <div
                    style={{ color: '#ff6e40', fontSize: 20 }}
                    className="card" id="third" >
                    <span className="font-link" id="thirdTitle">
                        Favorite Tracks
                    </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_track_URL[0]} style={{ textDecoration: 'none' }}> {favorite_track[0]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_track_URL[1]} style={{ textDecoration: 'none' }}> {favorite_track[1]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_track_URL[2]} style={{ textDecoration: 'none' }}> {favorite_track[2]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_track_URL[3]} style={{ textDecoration: 'none' }}> {favorite_track[3]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_track_URL[4]} style={{ textDecoration: 'none' }}> {favorite_track[4]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_track_URL[5]} style={{ textDecoration: 'none' }}> {favorite_track[5]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_track_URL[6]} style={{ textDecoration: 'none' }}> {favorite_track[6]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_track_URL[7]} style={{ textDecoration: 'none' }}> {favorite_track[7]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={favorite_track_URL[8]} style={{ textDecoration: 'none' }}> {favorite_track[8]} </a></span>
                </div>




            </div>
        );
    }





}