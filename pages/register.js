import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authenticate";

export default function Register() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [warning, setWarning] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await registerUser(user, password, password2);
      router.push("/login");
    } catch (err) {
      setWarning(err.message || JSON.stringify(err));
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Register</h1>
        <p className="auth-subtitle">Register for an account:</p>
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
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input 
            type="password" 
            className="form-input"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            autoComplete="new-password"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password:</label>
          <input 
            type="password" 
            className="form-input"
            value={password2} 
            onChange={e => setPassword2(e.target.value)} 
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" className="auth-button">Register</button>
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
        .auth-button:hover {
          background: #4a9fd8;
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
