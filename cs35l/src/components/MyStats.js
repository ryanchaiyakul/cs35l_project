import './MyStats.css';

//Function to get cookie (might have to change)
function getCookie(){
    var key, value, i;
    var cookieArray  = document.cookie.split(';');

    for (i = 0; i < cookieArray.length; i++){
        key = cookieArray[i].slice(0, cookieArray[i].indexOf("="));
        value = cookieArray[i].slice(cookieArray[i].indexOf("=")+1);
        if (key == 'userID'){
            alert('userID is ' + value);
        }
    }
}


function myStats() {
    
    return (
        
        <div
            style={{
                backgroundColor: '#02343F',}}
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
                style={{ color: '#F0EDCC', fontSize: 20}}
                className="card" id= "second" >
                
                <span className="font-link" id = "secondTitle">
                    Followed Artists
                </span>

                <span className="font-link" id="firstData"> Artist 1 </span>
                <span className="font-link" id="firstData"> Artist 2 </span>
                <span className="font-link" id="firstData"> Artist 3 </span>
                <span className="font-link" id="firstData"> Artist 4 </span>
            </div>


            {/* Third Column */}
            <div
                style={{ color: '#F0EDCC', fontSize: 20}}
                className="card" id= "third" >
                
                <span className="font-link" id = "thirdTitle">
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