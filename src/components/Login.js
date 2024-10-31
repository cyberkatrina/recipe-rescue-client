import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = (props) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // Check if the token is valid
      if (typeof res.data.token !== "string" || !res.data.token) {
        alert("Incorrect username or password");
      } else {
        props.setToken(res.data.token);
        
        navigate("/recipes"); // Navigate only if token is valid
      }
    } catch (err) {
      alert("Invalid username or password."); // Handle request errors
    }
  };

  return (
    <div className="bg1">
      
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email: 
          <input 
            type='email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required // Optional: Makes the field required
          />
        </label>
        <label>
          Password: 
          <input 
            type='password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required // Optional: Makes the field required
          />
        </label>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};
