import './MyStats.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';


//pass user_id as a query param into the get request 

//Fetch (url) localhost://4000
//method: GET


//Function to get the user_id for the cookie. (Find which user's statistics to show)
function getCookie() {
    var key, value, i;
    var cookieArray = document.cookie.split(';');


    for (i = 0; i < cookieArray.length; i++) {
        console.log(cookieArray);
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
async function fetchData(){
    //Equivalent to http://localhost:4000/_get_user_stats?user_id=getCookie()
    var recentlyPlayed = [];

    

    axios.get(`http://localhost:4000/_get_user_stats`, { params: { user_id: getCookie() } })
        .then((response) => {
            console.log("Size: ", response.data.recent.length)
            for (let i = 0; i < response.data.recent.length; i++) {
                recentlyPlayed[i] = response.data.recent[i].track.name;
                console.log("Recently played ", recentlyPlayed[i]);
            }
            return response.data;
        })
        //Handle Error
        .catch(error => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else {
                console.log('Other error', error.message);
            }
        });


        return recentlyPlayed;
}






export default function MyStats()  {
    //Render data before filling them in
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    //Render data
    useEffect(() => {
        async function check(){
            try {
                setLoading(true);
                const data = await fetchData();
                console.log("Data received");
                setData(data);
                setLoading(false);
              } 
              //Error
              catch (error) {
                setLoading(false);
                console.log("ERROR!");
              }
        }
        check();
     }, []);



     //Succesfully rendered all the data
     if(!loading && data){
        console.log("Loading complete");
     }
    
      

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
                <span className="font-link" id="firstTitle">
                    Favorites
                </span>

                <span className="font-link" id="firstData"> Fav 1 </span>
                <span className="font-link" id="firstData"> Fav 2 </span>
                <span className="font-link" id="firstData"> Fav 3 </span>
                <span className="font-link" id="firstData"> Fav 4 </span>
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
