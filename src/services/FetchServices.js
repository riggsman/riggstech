
import envConfig from "../config/envConfig";

const {API_URL} = envConfig;
// Simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const fetchServices = async (status = "online") => {

  const response = await fetch(`${API_URL}/services`);
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json() 

  await delay(500); // mock latency

  let filtered = data;

  if (status === "online") {
    filtered = data.filter((s) => s.is_online);
  } else if (status === "offline") {
    filtered = data.filter((s) => !s.is_online);
  }
  // else: return all
  console.log("Service from server: ", filtered);
  return filtered;
};

// Only export online fetch for public view
export const fetchOnlineServices = async () => {
  const response = await fetch(`${API_URL}/services?filter=online`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};