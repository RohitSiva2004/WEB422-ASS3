import { jwtDecode } from "jwt-decode";

export async function authenticateUser(user, password) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API URL is not configured. Please check your .env.local file.");
  }
  
  console.log("Calling API:", `${apiUrl}/login`);
  
  const res = await fetch(`${apiUrl}/login`, {
    method: "POST",
    body: JSON.stringify({ userName: user, password }),
    headers: { "content-type": "application/json" },
  });

  console.log("Response status:", res.status);
  
  
  if (!res.ok && res.status !== 200) {
    const text = await res.text();
    console.error("Response not OK. Status:", res.status, "Body:", text);
    throw new Error(`Login failed with status ${res.status}: ${text}`);
  }
  
  let data;
  try {
    data = await res.json();
    console.log("Response data:", JSON.stringify(data));
  } catch (parseErr) {
    console.error("Failed to parse response:", parseErr);
    const text = await res.text();
    throw new Error(`Invalid response from server: ${text}`);
  }
  

  if (res.status === 200 && data.token) {
    console.log("Token received, setting in localStorage");
    setToken(data.token);
    return data.token;
  } else if (res.status === 200 && !data.token) {
    console.error("Login succeeded but no token in response:", data);
    throw new Error("Login succeeded but server did not return a token");
  } else {
    const errorMsg = data.message || data.error || `Login failed with status ${res.status}`;
    console.error("Login failed:", errorMsg, data);
    throw new Error(errorMsg);
  }
}

export async function registerUser(user, password, password2) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: "POST",
    body: JSON.stringify({ userName: user, password, password2 }),
    headers: { "content-type": "application/json" },
  });

  const data = await res.json();
  if (res.status === 200) return data.message;
  else throw new Error(data.message || JSON.stringify(data));
}

export function setToken(token) {
  localStorage.setItem("access_token", token);
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-change'));
  }
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export function removeToken() {
  localStorage.removeItem("access_token");
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-change'));
  }
}

export function readToken() {
  try {
    const token = getToken();
    if (!token) {
      console.log("readToken: No token in localStorage");
      return null;
    }
    
    console.log("readToken: Token found, attempting to decode...");
    console.log("readToken: Token length:", token.length);
    console.log("readToken: Token preview:", token.substring(0, 50) + "...");
    
    const decoded = jwtDecode(token);
    console.log("readToken: Decoded successfully:", decoded);
    return decoded;
  } catch (err) {
    console.error("readToken: Error decoding token:", err);
    console.error("readToken: Error message:", err.message);
    
    const rawToken = getToken();
    console.error("readToken: Raw token:", rawToken);
    return null;
  }
}

export function isAuthenticated() {
  return !!readToken();
}
