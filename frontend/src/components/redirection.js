import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRedirect = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  const getCookie = () => {
    const cookieArray = document.cookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      const [key, value] = cookieArray[i].split('=');

      if (key.trim() === 'user_id') {
        return value;
      }
    }

    return '';
  };

  useEffect(() => {
    const id = getCookie();
    setUserId(id);
  }, []);

  console.log(userId);

  const checkLoginStatus = useCallback(async () => {
    const id = getCookie();
    setUserId(id);

    if (id === null || id === '') {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    // Redirect the user to Spotify login page
    window.location.href = 'http://localhost:4000/connect';
  };

  useEffect(() => {
    const intervalId = setInterval(checkLoginStatus, 5000); // Check login status every 5 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, []);

  useEffect(() => {
    checkLoginStatus(); // Check initial login status
  }, []);

  if (!isLoggedIn) {
    return (
      <div>
        <h1>You must log in</h1>
        <button onClick={handleLogin}>Login with Spotify</button>
      </div>
    );
  }

  return null;
};

export default LoginRedirect;
