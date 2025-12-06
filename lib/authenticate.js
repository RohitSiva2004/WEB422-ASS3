import { jwtDecode } from "jwt-decode";

export async function authenticateUser(user, password) {
  const res = await fetch(`/api/user?action=login`, {
    method: "POST",
    body: JSON.stringify({ userName: user, password }),
    headers: { "content-type": "application/json" },
  });

  const data = await res.json();
  
  if (res.status === 200 && data.token) {
    setToken(data.token);
    return data.token;
  } else {
    const errorMsg = data.message || data.error || `Login failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
}

export async function registerUser(user, password, password2) {
  const res = await fetch(`/api/user?action=register`, {
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
