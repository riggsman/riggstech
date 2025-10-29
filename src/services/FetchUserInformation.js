// apiService.js
import envConfig from "../config/envConfig";
import {UserContext} from "./../context/UserContext";
import { useContext } from "react";

const API_URL = envConfig.API_URL;



async function FetchUserProfileInformation() {
   const {token, profile} = useContext(UserContext)
  // Basic guard
 
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        "authorization": token
    }
    });
    console.log("SERVER RESPONSE ", await response.json());
    // Attempt to parse JSON body if present
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    // Normalize response based on status and payload
    if(response.ok){
            return data;
    } else {
      return { success: false, error: data?.detail,statusCode : response.status };
    }
  } catch (err) {
    // Network or unexpected error
    console.log(err);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export { FetchUserProfileInformation };


