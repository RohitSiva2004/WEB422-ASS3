import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticateUser } from "@/lib/authenticate";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { getFavourites } from "@/lib/userData";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const router = useRouter();

  useEffect(() => {
    console.log("Login component mounted");
    
    const logs = JSON.parse(localStorage.getItem('login_logs') || '[]');
    if (logs.length > 0) {
      console.log("=== PREVIOUS LOGIN ATTEMPT LOGS ===");
      logs.forEach(log => {
        console.log(`[${log.time}] ${log.msg}`);
      });
      localStorage.removeItem('login_logs');
    }
  }, []);

  async function updateAtom() {
    try {
      const favourites = await getFavourites();
      setFavouritesList(favourites || []);
    } catch (err) {
      console.warn("Failed to load favourites:", err);
      setFavouritesList([]); 
    }
  }

  async function handleSubmit(e) {
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
   
    const log = (msg) => {
      console.log(msg);
      const logs = JSON.parse(localStorage.getItem('login_logs') || '[]');
      logs.push({ time: new Date().toISOString(), msg });
      localStorage.setItem('login_logs', JSON.stringify(logs.slice(-20))); 
    };
    
    log("=== HANDLE SUBMIT CALLED ===");
    
    if (loading) {
      log("Already loading, preventing double submission");
      return false;
    }
    
    setWarning("");
    setLoading(true);
    
    if (!user || !password) {
      log("Missing username or password");
      setWarning("Please enter both username and password");
      setLoading(false);
      return false;
    }
    
    try {
      log(`Starting authentication for user: ${user}`);
      
      const token = await authenticateUser(user, password);
      log("Authentication successful, token received");
      
   
      let storedToken = localStorage.getItem("access_token");
      if (!storedToken) {
        throw new Error("Token was not saved to localStorage");
      }
      log("Token verified in localStorage");
      
      
      window.dispatchEvent(new Event('auth-change'));
      log("Auth-change event dispatched");
      
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      log("Loading favourites...");
      try {
        await updateAtom();
        log("Favourites loaded");
      } catch (favErr) {
        log(`Warning: Failed to load favourites: ${favErr.message}`);
        
      }
      
      log("Redirecting to home page...");
    
      localStorage.removeItem('login_logs');
      
      window.location.href = "/";
    } catch (err) {
      log(`ERROR: ${err.message}`);
      log(`ERROR STACK: ${err.stack}`);
      console.error("=== LOGIN ERROR ===", err);
      setWarning(err.message || JSON.stringify(err));
      setLoading(false);
      return false;
    }
    
    return false;
  }

  return (
    <div className="auth-container">
      <form 
        className="auth-form" 
        onSubmit={async (e) => {
          console.log("Form onSubmit handler called!");
          e.preventDefault();
          e.stopPropagation();
          await handleSubmit(e);
          return false; 
        }}
        noValidate
      >
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Enter your login information below:</p>
        {warning && <div className="alert alert-danger">{warning}</div>}
        <div className="form-group">
          <label className="form-label">User:</label>
          <input 
            type="text" 
            className="form-input"
            value={user} 
            onChange={e => setUser(e.target.value)} 
            autoComplete="username"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input 
            type="password" 
            className="form-input"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>
        <button 
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <style jsx>{`
        .auth-container { 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 80vh; 
          background-color: #f5f5f5;
          padding: 20px;
        }
        .auth-form { 
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
        }
        .auth-title {
          font-size: 2.5rem;
          color: #5dade2;
          text-align: center;
          margin: 0 0 10px 0;
          font-weight: 400;
        }
        .auth-subtitle {
          color: #666;
          text-align: center;
          margin: 0 0 30px 0;
          font-size: 0.95rem;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          display: block;
          color: #666;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
        .form-input {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .form-input:focus {
          outline: none;
          border-color: #5dade2;
        }
        .form-input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
        .auth-button {
          padding: 12px 24px;
          font-size: 1rem;
          background: #5dade2;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          align-self: flex-start;
          margin-top: 10px;
        }
        .auth-button:hover:not(:disabled) {
          background: #4a9fd8;
        }
        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .alert {
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 4px;
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>
    </div>
  );
}
