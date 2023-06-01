import './MyStats.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';


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
            return value;
        }
    }
}


function getURL(data){
    console.log("RUNNING FUNCTION");
    // URL = data.track.external_urls;
    URL = "LJSDF";

    return URL;
}
//Retrieve recetnly played music

//Fetch data
async function fetchData() {
    //Equivalent to http://localhost:4000/_get_user_stats?user_id=getCookie()
    var recentlyPlayed = [];
    var response = await axios.get(`http://localhost:4000/_get_user_stats`, { params: { user_id: getCookie() } });
    recentlyPlayed = response.data;
    console.log("Returning ", response.data);

    
    //Return the formulated data    
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
        console.log("Data received: ", data);


        //Get Recently Played List (After 40 characters, it will cut off (replace with ...))
        for (let i = 0; i < 9; i++) {
            if(i >= data.recent.length){
                recentlyPlayed[i] = "Listen to more songs to add!";
            }
            else{
                if(data.recent[i].track.name.length > 40){
                    recentlyPlayed[i] = data.recent[i].track.name.substring(0, 37) + "...";
                }
                else{
                    recentlyPlayed[i] = data.recent[i].track.name;
                    console.log("Song: ", i, + ""+ data.recent[i].track.name);
                }
            }
           
        }
        console.log(data.recent[0].track.external_urls.spotify);

        return (
            <div
                style={{
                    backgroundColor: '#50586C',
                }}
                className="App" >
    
    
                <div
                    style={{ color: '#DCE2F0', fontSize: 50, padding: 0 }}
                    className="card">
                    <span className="font-link">
                        My Stats
                    </span>
                </div>
    
    
                <div
                    style={{ color: '#DEBFB9', fontSize: 20, marginLeft: 'auto' }}
                    className="card" id="first">
                    
                      
                    {/* Title */}
                    <span className = "font-link" id = "firstTitle">
                        Recently Played
                    </span>
    
                    {/* Think about how many elements for each row */}
                    <span className="font-link" id="data_entry"> 
                        

                        <a class = "a" href={data.recent[0].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[0]} </a>

                    </span>
    
        
                    <span className="font-link" id="data_entry"> 
                        <a class = "a" href={data.recent[1].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[1]} </a>
                    </span>
    
                    <span className="font-link" id="data_entry"> 
                        <a class = "a" href={data.recent[2].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[2]} </a>
                    </span>
    
    
                   
                    <span className="font-link" id="data_entry"> 
                        <a class = "a" href={data.recent[3].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[3]} </a>
                    </span>
                    <span className="font-link" id="data_entry"> 
                        <a class = "a" href={data.recent[4].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[4]} </a>
                    </span>

                    <span className="font-link" id="data_entry"> 
                        <a class = "a" href={data.recent[5].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[5]} </a>
                    </span>
                    <span className="font-link" id="data_entry"> 
                        <a class = "a" href={data.recent[6].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[6]} </a>
                    </span>

                    <span className="font-link" id="data_entry"> 
                        <a class = "a" href={data.recent[7].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[7]} </a>
                    </span>

                    <span className="font-link" id="data_entry"> 
                        <a class = "a" href={data.recent[8].track.external_urls.spotify} style={{ textDecoration: 'none' }}> {recentlyPlayed[8]} </a>
                    </span>

                </div>
    
    
                {/* Second Column */}
                <div style={{ color: '#F0EDCC', fontSize: 20 }}
                    className="card" id="second" >
    
                    <span className="font-link" id="secondTitle">
                        Followed Artists
                    </span>
    
                    <span className="font-link" id="data_entry"> Artist 1 </span>
                    <span className="font-link" id="data_entry"> Artist 2 </span>
                    <span className="font-link" id="data_entry"> Artist 3 </span>
                    <span className="font-link" id="data_entry"> Artist 4 </span>
                </div>
    
    
                {/* Third Column */}
                <div
                    style={{ color: '#F0EDCC', fontSize: 20 }}
                    className="card" id="third" >
                    <span className="font-link" id="thirdTitle">
                        Top Tracks
                    </span>
                    <span className="font-link" id="data_entry"> Artist 1 </span>
                    <span className="font-link" id="data_entry"> Artist 2 </span>
                    <span className="font-link" id="data_entry"> Artist 3 </span>
                    <span className="font-link" id="data_entry"> Artist 4 </span>
                </div>
    
    
    
    
            </div>
        );
    }


    
    
   
}
