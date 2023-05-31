import './MyStats.css';
import axios from 'axios';


//pass user_id as a query param into the get request 

let userId = "";
//Fetch (url) localhost://4000
//method: GET


//Get request confirmed that get cookie works. 
//Function to get the user_id for the cookie. (Find which user's statistics to show)
function getCookie() {
    var key, value, i;
    var cookieArray = document.cookie.split(';');


    for (i = 0; i < cookieArray.length; i++) {
        console.log(cookieArray);
        key = cookieArray[i].slice(0, cookieArray[i].indexOf("="));
        value = cookieArray[i].slice(cookieArray[i].indexOf("=") + 1);
        if (key == 'user_id') {
            console.log('userID is ' + value);
            return value;
        }
    }
}



//Trying to put as query param into (Which redirection URL?)
async function fetchStats() {
    // const response = await fetch("http://localhost:4000/get_user_stats", {
    //     method: "GET", // or 'PUT'
    //     body: JSON.stringify(data),
    //   });

    //Original
    console.log("Tyring to fetch data")
    //  console.log("URL: " + `http://localhost:4000/_get_user_stats`, {params: {user_id: '31kdkadqj5weprsc4drjd2o6gnry'}});

    //Original
    // const response = await axios.get(`http://localhost:4000/_get_user_stats`, {params: {user_id:getCookie()}})

    //Equivalent to http://localhost:4000/_get_user_stats?user_id=getCookie()
    //request.cookies["user_id"]) not activating
    axios.get(`http://localhost:4000/_get_user_stats`, { params: { user_id: getCookie() } })
        .then((response) => {
            console.log("Response: ", response.data)
            console.log("Recently played: " + response.data.recent[0].track.name)
        })
        .catch(error => {
            // Handle error
            if (error.response) {

                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Other error', error.message);
            }
        });






    // console.log("The data retrieved: " + response.data.recent.length);

    //Specify query_parameters
    //user.get_recent_tracks(10)
    // ttracks = await user.get_top_tracks(10)
    // artists = await user.get_top_artists(10)
    //console.log(response);

    //const result = await response.json();
    //console.log("Result: " + result);
    // if(result.ok){
    //     console.log("Succesfully retrieved the stats")
    // }
    // else{
    //     console.log("Couldn't retrieve the stats");
    // }
}


function myStats() {
    fetchStats()
    //URL

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
export default myStats