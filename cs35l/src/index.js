import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MyStats from './components/MyStats';
import MyHomescreen from './pages/MyHomescreen';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     {/* <MyStats/>   Uncomment this for now (Working on homepage*/}
     <MyHomescreen/> 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
