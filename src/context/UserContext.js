import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode";
import { FetchUserProfileInformation } from '../services/FetchUserInformation';
import envConfig from "../config/envConfig";
const API_URL = envConfig.API_URL;



export const UserContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [exercises, setExercises] = useState({ newExercise: 0 });  // Shared stats for badges
  const [isUser, setIsUser] = useState(true);  // Shared stats for badges
  const [user_id, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [profileData, setUserProfile] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'false');  //localStorage.getItem('isLoggedIn') === 'false'


   useEffect(() => {
    // localStorage.setItem('isLoggedIn', isLoggedIn);
    if(localStorage.getItem("isLoggedIn") === "true"){
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
  }, []);

  const login = (loginData) => {
    console.log("LOGIN FUNCTION CALLED SUCCESSFULLY")
    localStorage.setItem('userToken', loginData.access_token);
    localStorage.setItem("userRefreshToken", loginData.refreshToken);
    setUserId(loginData.userId);
    setToken(loginData.access_token);
    if(isLoggedIn === false){
      localStorage.setItem("isLoggedIn","true");
      setIsLoggedIn(true);
    }
   
    console.log("LOGIN STATE : ",setIsLoggedIn(true));
  };

   useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }
  }, [token]);


// Fetch user info (example API)
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserProfile(data); // store user info in state
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Run once on app start
  useEffect(() => {
    fetchUserProfile();
  }, []);
 
  const logout = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    console.log( localStorage.removeItem("isLoggedIn"))
    console.log("LOGOUT FUNCTION CALLED SUCCESSFULLY")
  };

  const updateExercises = (newExercises) => {
    setExercises(newExercises);
  };

  return (
    <UserContext.Provider value={{ token, login, logout, exercises, updateExercises , isUser, user, isLoggedIn,profileData, setUserProfile, fetchUserProfile}}>
      {children}
    </UserContext.Provider>
  );
};
