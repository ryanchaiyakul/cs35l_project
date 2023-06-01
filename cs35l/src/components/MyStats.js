import './MyStats.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
//Easy scrollable
import Header from "./header";


//pass user_id as a query param into the get request 

//Fetch (url) localhost://4000
//method: GET


//Function to get the user_id for the cookie. (Find which user's statistics to show)
function getCookie() {
    var key, value, i;
    var cookieArray = document.cookie.split(';');
    for (i = 0; i < cookieArray.length; i++) {
        key = cookieArray[i].slice(0, cookieArray[i].indexOf("="));
        value = cookieArray[i].slice(cookieArray[i].indexOf("=") + 1);
        if (key == 'user_id') {
            console.log("KEY: " + value)
            return value;
        }
    }
}


function getURL(data) {
    console.log("RUNNING FUNCTION");
    // URL = data.track.external_urls;
    URL = "LJSDF";

    return URL;
}
//Retrieve recetnly played music

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
            }
        }
        check();
    }, []);


    //Succesfully rendered all the data
    var recentlyPlayed = [];
    var favorite_artists = [];
    var favorite_track = []
    if (!loading && data) {
        // console.log("Data received: ", data);


        //Get Recently Played List (After 40 characters, it will cut off (replace with ...))
        for (let i = 0; i < 9; i++) {
            if (i >= data.recent.length) {
                recentlyPlayed[i] = "Listen to more songs to add!";
            }
            else {
                if (data.recent[i].track.name.length > 40) {
                    recentlyPlayed[i] = data.recent[i].track.name.substring(0, 37) + "...";
                }
                else {
                    recentlyPlayed[i] = data.recent[i].track.name;
                    console.log("Song: ", i, + "" + data.recent[i].track.name);
                }
            }
        }
        //Get favorite artists
        for (let i = 0; i < 9; i++) {
            if (i >= data.top_tracks.length) {
                favorite_track[i] = "";
            }
            else {
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
                
            }
            else {
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
            <div style={{ backgroundColor: '#1e3d59', height: '360vh' }} className="App" >
                <Header />

                <div
                    style={{ color: '#f5f0e1', fontSize: 20, top:'0px' }}
                    className="card" id="first">


                    {/* Title */}
                    <span className="font-link" id="firstTitle">
                        Recently Played
                    </span>

                    {/* Think about how many elements for each row */}
                    <span className="font-link" id="data_entry"> <a class="a" href={data.recent[0].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[0]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.recent[1].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[1]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.recent[2].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[2]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.recent[3].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[3]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.recent[4].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[4]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.recent[5].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[5]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.recent[6].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[6]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.recent[7].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[7]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.recent[8].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[8]} </a></span>

                </div>


                {/* Second Column */}
                <div style={{ color: '#F0EDCC', fontSize: 20 }}
                    className="card" id="second" >

                    <span className="font-link" id="secondTitle">
                        Favorite Artists
                    </span>

                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_artists[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_artists[0]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_artists[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_artists[1]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_artists[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_artists[2]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_artists[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_artists[3]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_artists[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_artists[4]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_artists[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_artists[5]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_artists[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_artists[6]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_artists[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_artists[7]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_artists[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_artists[8]} </a></span>
                </div>


                {/* Third Column */}
                <div
                    style={{ color: '#F0EDCC', fontSize: 20 }}
                    className="card" id="third" >
                    <span className="font-link" id="thirdTitle">
                        Favorite Tracks
                    </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_tracks[0].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_track[0]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_tracks[1].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_track[1]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_tracks[2].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_track[2]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_tracks[3].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_track[3]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_tracks[4].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_track[4]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_tracks[5].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_track[5]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_tracks[6].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_track[6]} </a> </span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_tracks[7].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_track[7]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={data.top_tracks[8].external_urls.spotify} style={{ textDecoration: 'none' }}> {favorite_track[8]} </a></span>
                </div>




            </div>
        );
    }





}
