// apiService.js
import envConfig from "../config/envConfig";
const API_URL = envConfig.API_URL;

async function RegistrationProvider(formData) {
  // Basic guard
  if (!formData || typeof formData !== 'object') {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    console.log(API_URL);
    // Attempt to parse JSON body if present
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    // Normalize response based on status and payload
    if(response.ok){
            return { 
              success: true, 
              data: data, 
              token: data.token,
              error: "Registration successful",
              statusCode : response.status
            };
            // { success: true, data: data, token: data.token, error: "Registration successful" };
    } else {
      // Expecting a payload with at least a message or success flag
      return { success: false, error: data?.detail,statusCode : response.status };
    }
  } catch (err) {
    // Network or unexpected error
    console.log(err);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export { RegistrationProvider };


// useEffect(() => {
//   const fetchPrograms = async () => {
//     const response = await fetch('/api/user/programs', {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });
//     const data = await response.json();
//     // Set data
//   };
//   fetchPrograms();
// }, []);