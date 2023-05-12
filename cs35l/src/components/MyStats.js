import './MyStats.css';

function myStats() {
    return (
        <div
            style={{
                height: '100vh',
                backgroundColor: '#02343F',
            }}
            className="App">

            <div
                style={{ color: '#F0EDCC', fontSize: 50 }}
                className="card">
                <span className="font-link">
                    My Stats
                </span>
            </div>



            <div
                style={{ color: '#F0EDCC', fontSize: 20, marginLeft: 'auto' }}
                className="card" id="first">
                <span className="font-link">
                    Favorites
                </span>
            </div>




            <div
                style={{ color: '#F0EDCC', fontSize: 20, marginLeft: 'auto' }}
                className="card" id="second">
                <span className="font-link">
                    Followed Artists
                </span>
            </div>




            <div
                style={{ color: '#F0EDCC', fontSize: 20, marginLeft: 'auto' }}
                className="card" id="third">
                <span className="font-link">
                    Listening Hours
                </span>
            </div>



            <div id="firstData">
                    <span className="font-link">
                        List of Favorites
                    </span>
            </div>





        </div>
    );
}
export default myStats