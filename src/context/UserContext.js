// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import envConfig from "../config/envConfig";
import { safeJsonParser } from '../components/SafeJsonParser';

const API_URL = envConfig.API_URL;

export const UserContext = createContext();




export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [exercises, setExercises] = useState({ newExercise: 0 });
  const [isUser, setIsUser] = useState(true);
  const [user_id, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [profileData, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // NEW: registered programs
  const [registeredPrograms, setRegisteredPrograms] = useState([]);

  // src/context/UserContext.jsx  (add these lines)

  const [activeSection, setActiveSection] = useState(null);   // <-- NEW

  const [submittedAssignments, setSubmittedAssignments] = useState(null);

  const fetchSubmittedAssignments = async () => {
    const res = await fetch(`${API_URL}/user/assignments`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await safeJsonParser(res);
    setSubmittedAssignments(data.assignments);
  };
    // inside the Provider value:
    <UserContext.Provider value={{
      /* … existing values … */
      activeSection,
      fetchSubmittedAssignments,
      setActiveSection,          // <-- expose it
  }}>
</UserContext.Provider>
  // -----------------------------------------------------------------
  //  Login / Logout / Token decode
  // -----------------------------------------------------------------
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, []);

  const login = (loginData) => {
    localStorage.setItem('userToken', loginData.access_token);
    localStorage.setItem("userRefreshToken", loginData.refreshToken);
    localStorage.setItem("isLoggedIn", "true");
    setToken(loginData.access_token);
    setUserId(loginData.userId);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (token) {
      try { setUser(jwtDecode(token)); }
      catch (e) { console.error("Failed to decode token:", e); }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRefreshToken');
    localStorage.removeItem('isLoggedIn');
    setToken(null);
    setIsLoggedIn(false);
    setUserProfile(null);
    setRegisteredPrograms([]);
  };

  const updateExercises = (newExercises) => setExercises(newExercises);

  // -----------------------------------------------------------------
  //  PROFILE
  // -----------------------------------------------------------------
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setUserProfile(data);
    } catch (e) { console.error(e); }
  };

  // -----------------------------------------------------------------
  //  PROGRAMS
  // -----------------------------------------------------------------
  const fetchRegisteredPrograms = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${API_URL}/user/programs`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch programs');
      const data = await res.json();
      setRegisteredPrograms(data);               // <-- assume API returns array of programs
    } catch (e) { console.error(e); }
  };

  // -----------------------------------------------------------------
  //  ASSIGNMENT SUBMISSION
  // -----------------------------------------------------------------
  const submitAssignment = async (file) => {
    const token = localStorage.getItem('userToken');
    const form = new FormData();
    form.append('assignment', file);

    const res = await fetch(`${API_URL}/assignments/submit`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form,
    });

    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  };

  // -----------------------------------------------------------------
  //  Run on mount (profile + programs)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchRegisteredPrograms();
    }
  }, [token]);

  return (
    <UserContext.Provider value={{
      token, login, logout,
      exercises, updateExercises,
      isUser, user, isLoggedIn,
      profileData, setUserProfile, fetchUserProfile,
      registeredPrograms, setRegisteredPrograms, fetchRegisteredPrograms,
      submitAssignment,fetchSubmittedAssignments,setSubmittedAssignments, activeSection,
      setActiveSection,
    }}>
      {children}
    </UserContext.Provider>
  );
};










// import React, { createContext, useState, useEffect } from 'react';
// import {jwtDecode} from "jwt-decode";
// import { FetchUserProfileInformation } from '../services/FetchUserInformation';
// import envConfig from "../config/envConfig";
// const API_URL = envConfig.API_URL;



// export const UserContext = createContext();

// export const UserAuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('userToken'));
//   const [exercises, setExercises] = useState({ newExercise: 0 });  // Shared stats for badges
//   const [isUser, setIsUser] = useState(true);  // Shared stats for badges
//   const [user_id, setUserId] = useState("");
//   const [user, setUser] = useState(null);
//   const [profileData, setUserProfile] = useState(null)
//   const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'false');  //localStorage.getItem('isLoggedIn') === 'false'


//    useEffect(() => {
//     // localStorage.setItem('isLoggedIn', isLoggedIn);
//     if(localStorage.getItem("isLoggedIn") === "true"){
//       setIsLoggedIn(true);
//     }else{
//       setIsLoggedIn(false);
//     }
//   }, []);

//   const login = (loginData) => {
//     console.log("LOGIN FUNCTION CALLED SUCCESSFULLY")
//     localStorage.setItem('userToken', loginData.access_token);
//     localStorage.setItem("userRefreshToken", loginData.refreshToken);
//     setUserId(loginData.userId);
//     setToken(loginData.access_token);
//     if(isLoggedIn === false){
//       localStorage.setItem("isLoggedIn","true");
//       setIsLoggedIn(true);
//     }
   
//     console.log("LOGIN STATE : ",setIsLoggedIn(true));
//   };

//    useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUser(decoded);
//       } catch (e) {
//         console.error("Failed to decode token:", e);
//       }
//     }
//   }, [token]);


// // Fetch user info (example API)
//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_URL}/user/profile`, {
//         method: 'GET',
//         headers: {
//           'Authorization': 'Bearer ' + token,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch user profile');
//       }

//       const data = await response.json();
//       setUserProfile(data); // store user info in state
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };

//   // Run once on app start
//   useEffect(() => {
//     fetchUserProfile();
//   }, []);
 
//   const logout = () => {
//     localStorage.removeItem('userToken');
//     setToken(null);
//     setIsLoggedIn(false);
//     localStorage.removeItem("isLoggedIn");
//     console.log( localStorage.removeItem("isLoggedIn"))
//     console.log("LOGOUT FUNCTION CALLED SUCCESSFULLY")
//   };

//   const updateExercises = (newExercises) => {
//     setExercises(newExercises);
//   };

//   return (
//     <UserContext.Provider value={{ token, login, logout, exercises, updateExercises , isUser, user, isLoggedIn,profileData, setUserProfile, fetchUserProfile}}>
//       {children}
//     </UserContext.Provider>
//   );
// };
