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
            //console.log('userID is ' + value);
            return value;
        }
    }
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


        //Get Recently Played List
        for (let i = 0; i < data.recent.length; i++) {
            recentlyPlayed[i] = data.recent[i].track.name;
            console.log("Recently played: " + data.recent[i].track.name);
        }

        // for (let i = 0; i < data.recent.length; i++) {
        //     recentlyPlayed[i] = data.recent[i].track.name;
        //     console.log("Recently played: " + data.recent[i].track.name);
        // }
    }


    var dataType = 'HELLO';
    return (
        <div
            style={{
                backgroundColor: '#02343F',
            }}
            className="App" >


            <div
                style={{ color: '#F0EDCC', fontSize: 50, padding: 0 }}
                className="card">
                <span className="font-link">
                    My Stats
                </span>
            </div>


            <div
                style={{ color: '#F0EDCC', fontSize: 20, marginLeft: 'auto' }}
                className="card" id="first">
                
              
                

                {/* Title */}
                <span className = "font-link" id = "firstTitle" >
                    Recently Heard
                </span>
                <span className="font-link" id="firstData"> {recentlyPlayed[0]} </span>
                <span className="font-link" id="firstData"> {recentlyPlayed[1]} </span>
                <span className="font-link" id="firstData"> {recentlyPlayed[2]} </span>
                <span className="font-link" id="firstData"> {recentlyPlayed[3]} </span>
            </div>


            {/* Second Column */}
            <div
                style={{ color: '#F0EDCC', fontSize: 20 }}
                className="card" id="second" >

                <span className="font-link" id="secondTitle">
                    Followed Artists
                </span>

                <span className="font-link" id="firstData"> Artist 1 </span>
                <span className="font-link" id="firstData"> Artist 2 </span>
                <span className="font-link" id="firstData"> Artist 3 </span>
                <span className="font-link" id="firstData"> Artist 4 </span>
            </div>


            {/* Third Column */}
            <div
                style={{ color: '#F0EDCC', fontSize: 20 }}
                className="card" id="third" >
                <span className="font-link" id="thirdTitle">
                    Listening Hours
                </span>
                <span className="font-link" id="firstData"> Artist 1 </span>
                <span className="font-link" id="firstData"> Artist 2 </span>
                <span className="font-link" id="firstData"> Artist 3 </span>
                <span className="font-link" id="firstData"> Artist 4 </span>
            </div>




        </div>
    );
}
