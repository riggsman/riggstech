// utils/safeJsonParse.js
export const safeJsonParser = async (response) => {
  const text = await response.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON:", text.substring(0, 200));
    return { error: "Invalid response from server" };
  }
};