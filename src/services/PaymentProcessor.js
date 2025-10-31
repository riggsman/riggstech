// apiService.js
import envConfig from "../config/envConfig";
const API_URL = envConfig.API_URL;

async function paymentInitiatorProvider(formData,userData) {

  try {
     
      const response = await fetch(`${API_URL}/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: userData.userId,
          email: userData.email
        })
      });
      console.log("USER DATA EMAIL",userData.email);
       // Attempt to parse JSON body if present
       let data = null;
        try {
        data = await response.json();
        } catch {
        data = null;
        }
        console.log("DATA",data);
    if(response.ok){
        return {
                success: data?.success,
                error: data?.message,
                statusCode : response.status,
                loader:true
        }
    } else {
        return { success: false, error: data?.message,statusCode : response.status,loader:false };
    }
  } catch (err) {
    // Network or unexpected error
    console.log(err);
    return { success: false, error: 'Network error. Please try again.',loader:false };
  }
}

export { paymentInitiatorProvider };

async function paymentProvider(formData) {

  try {
     
      const response = await fetch(`${API_URL}/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
        })
      });
      console.log(response.body);
       // Attempt to parse JSON body if present
       let data = null;
        try {
        data = await response.json();
        } catch {
        data = null;
        }
    if(response.ok){
        return {
                success: data?.success,
                error: data?.message,
                statusCode : response.status,
                loader:true
        }
    } else {
        return { success: false, error: data?.message,statusCode : response.status,loader:false };
    }
  } catch (err) {
    // Network or unexpected error
    console.log(err);
    return { success: false, error: 'Network error. Please try again.',loader:false };
  }
}

export { paymentProvider };


async function paymentVerificationProvider(formData,userData) {

  try {
      const response = await fetch(`${API_URL}/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // userId: userData.phone
        })
      });
       // Attempt to parse JSON body if present
       let data = null;
        try {
        data = await response.json();
        } catch {
        data = null;
        }
    if(response.ok){
        return {
                success: data?.success,
                error: data?.message,
                statusCode : response.status
        }
    } else {
        return { success: false, error: data?.message,statusCode : response.status };
    }
  } catch (err) {
    // Network or unexpected error
    console.log(err);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export { paymentVerificationProvider };