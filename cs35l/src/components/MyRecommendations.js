//Work on the homescreen
import './MyRecommendations.css';
//For navigating to different pages
// import MyStats from "./MyStats";

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



const MyRecommendations = () =>{
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
    var my_recommendations = [];

    if (!loading && data) {
        return (
            <div style={{ backgroundColor: '#1e3d59', height: '360vh' }} className="App" >
                <div
                    style={{ color: '#ff6e40', fontSize: 20, top: '0px' }}
                    className="card" id="title_component">
                    {/* Title */}
                    <span className="font-link" id="title_style">
                        Recommendations
                    </span>
                </div>
            </div>
        );
    }
}
export default MyRecommendations;