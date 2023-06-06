// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const LoginRedirect = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userId, setUserId] = useState('');

//   const getCookie = () => {
//     const cookieArray = document.cookie.split(';');

//     for (let i = 0; i < cookieArray.length; i++) {
//       const [key, value] = cookieArray[i].split('=');

//       if (key.trim() === 'user_id') {
//         return value;
//       }
//     }

//     return '';
//   };

//   useEffect(() => {
//     const id = getCookie();
//     setUserId(id);
//   }, []);

//   console.log(userId);

//   const checkLoginStatus = async () => {
//     try {
//       const response = await fetch('/_get', {
//         method: 'GET',
//         credentials: 'include', // Send cookies with the request
//       });

//       if (response.ok) {
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//       }
//     } catch (error) {
//       console.error('Error checking login status:', error);
//     }
//   };

//   const handleLogin = () => {
//     // Redirect the user to Spotify login page
//     window.location.href = 'http://localhost:4000/connect';
//   };

//   useEffect(() => {
//     checkLoginStatus(); // Check initial login status

//     const intervalId = setInterval(checkLoginStatus, 5000); // Check login status every 5 seconds

//     return () => {
//       clearInterval(intervalId); // Clear the interval when the component unmounts
//     };
//   }, []);

//   if (!isLoggedIn) {
//     return (
//       <div>
//         <h1>You must log in</h1>
//         <button onClick={handleLogin}>Login with Spotify</button>
//       </div>
//     );
//   }

//   // If the user is logged in, redirect them back to localhost:3000
//   navigate('/');

//   return null;
// };

// export default LoginRedirect;
