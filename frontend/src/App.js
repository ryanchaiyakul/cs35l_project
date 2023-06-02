import logo from './logo.svg';

import './components/MyStats';
import './App.css';
import MyStats from './components/MyStats';
import MyRecommendations from './components/MyRecommendations'

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from "react-router-dom";

function App() {
  //const navigate = useNavigate()

  function handleClick() {
    console.log("Navigating to home screen");
    //  navigate("/MyStats");
  }

  return (
    <div>
      {/* <MyStats/> */}
      <MyRecommendations/>

      {/* <Routes>
        <Route path="MyStats" element={<Navigate to="/MyStats"/>} />
      </Routes> */}

      {/* <Link to="/" exact>
          Home
        </Link>

        <Link to="/MyStats">
          My Stats
        </Link>


        <Link to="/MyRecommendations">
          {/* <MyStats/> */}
      {/* My Recommendations
        </Link> */}

      {/* <button type="button" onClick={handleClick}>
        Go home
      </button> */}
    </div>

    // <Route path="/" component={<MyStats/>} />
    // <Route path="/MyStats" component={<MyStats />} />
    // <Route path="/MyRecommendations" component={<MyRecommendatio ns />} />

  );



}
export default App;