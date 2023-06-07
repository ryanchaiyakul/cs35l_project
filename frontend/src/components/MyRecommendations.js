//Work on the homescreen
import './MyRecommendations.css';
//For navigating to different pages

import MyStats from "./MyStats";
import './MyStats.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
//Easy scrollable
import Header from "./header";
import { Navigate } from "react-router-dom";

//Used for hamburger menu
import { slide as Menu } from 'react-burger-menu';


//Endpoint =  /_get_user_recommendations

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



//Retrieve recetnly played music
//Fetch data
//Equivalent to http://localhost:4000/_get_user_stats?user_id=getCookie()
async function fetchData() {
    var recentlyPlayed = [];
    var response = await axios.get(`http://localhost:4000/_get_user_recommendations`, { params: { user_id: getCookie() } });
    recentlyPlayed = response.data;
    console.log("Returning ", response.data);

    return response.data;
}



// const MyRecommendations = () => {
//     const[goToStats, setGotoStats] =  useState(false);


//     //Render data before filling them in
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);



//     //Render data to gather information
//     useEffect(() => {
//         async function check() {
//             try {
//                 setLoading(true);
//                 const data = await fetchData();
//                 let fetchedData = await fetchData();

//                 setData(data);
//                 setLoading(false);
//             }
//             //Error
//             catch (error) {
//                 setLoading(false);
//                 console.log("ERROR!", error);
//             }
//         }
//         check();
//     }, []);


//     if(goToStats){
//         console.log("Going to stats page");
//         return <MyStats/>
//     }

//     //Succesfully rendered all the data

//         return (<div style={{ backgroundColor: '#1e3d59', height: '200vh' }} className="App" >

//             <div
//                 style={{ color: '#ff6e40', fontSize: 20, top: '0px' }}
//                 className="card" id="first">

//                 <button onClick={()=>{setGotoStats(true); }}>
//                     Go to Stats
//                 </button>


//                 {/* Title */}
//                 <span className="font-link" id="firstTitle">
//                     Recommendations
//                 </span>

//                 {/* Think about how many elements for each row */}
//                 <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[0]} style={{ textDecoration: 'none' }}> {my_recommendations[0]} </a></span>
//                 <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[1]} style={{ textDecoration: 'none' }}> {my_recommendations[1]} </a> </span>
//                 <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[2]} style={{ textDecoration: 'none' }}> {my_recommendations[2]} </a> </span>
//                 <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[3]} style={{ textDecoration: 'none' }}> {my_recommendations[3]} </a> </span>
//                 <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[4]} style={{ textDecoration: 'none' }}> {my_recommendations[4]} </a></span>
//                 <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[5]} style={{ textDecoration: 'none' }}> {my_recommendations[5]} </a> </span>
//                 <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[6]} style={{ textDecoration: 'none' }}> {my_recommendations[6]} </a> </span>
//                 <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[7]} style={{ textDecoration: 'none' }}> {my_recommendations[7]} </a></span>
//                 <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[8]} style={{ textDecoration: 'none' }}> {my_recommendations[8]} </a></span>

//             </div>



//         </div>
//         );
//     }
// }

// export default MyRecommendations;

export default MyRecommendations => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
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
    var my_recommendations = [];
    var recommend_URL = [];

    if (!loading && data) {
        for (let i = 0; i < 10; i++) {
            if (i >= data.length) {
                my_recommendations[i] = "";
                recommend_URL[i] = "";
            }
            else {
                my_recommendations[i] = data[i].name;
                recommend_URL[i] = data[i].external_urls.spotify;
            }
        }
        return (
            <div style={{ backgroundColor: '#1e3d59', height: '100vh' }} className="App" >
                <Menu>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[0]} style={{ textDecoration: 'none',}}> {my_recommendations[0]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[1]} style={{ textDecoration: 'none' }}> {my_recommendations[1]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[2]} style={{ textDecoration: 'none' }}> {my_recommendations[2]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[3]} style={{ textDecoration: 'none' }}> {my_recommendations[3]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[4]} style={{ textDecoration: 'none' }}> {my_recommendations[4]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[5]} style={{ textDecoration: 'none' }}> {my_recommendations[5]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[6]} style={{ textDecoration: 'none' }}> {my_recommendations[6]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[7]} style={{ textDecoration: 'none' }}> {my_recommendations[7]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[8]} style={{ textDecoration: 'none' }}> {my_recommendations[8]} </a></span>
                    <span className="font-link" id="data_entry"> <a class="a" href={recommend_URL[9]} style={{ textDecoration: 'none' }}> {my_recommendations[9]} </a></span>



                   
                    

                    
                </Menu>
            </div>

        );
    }
}