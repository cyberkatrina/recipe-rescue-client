import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { Recipes } from "./components/Recipes";
import { Routes, Route, Navigate } from "react-router";
import * as cookie from 'cookie';

function App() {
  const [token, setToken] = useState("");
  
  // Parse the cookies and set it in state
  const cookies = cookie.parse(document.cookie);

  useEffect(() => {
    if (cookies.name) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:5000/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Log the user data or handle it accordingly
          console.log("User data:", response.data);
        } catch (error) {
          console.error(
            "Error fetching users:",
            error.response ? error.response.data : error.message
          );
          // Optionally handle error (e.g., show an alert or message)
        }
      };
      fetchUsers();
    }
  }, [cookies.name]); // Watch cookies.name to update if login status changes

  const ProtectedRoute = ({ component: Component, ...rest }) => {
    return cookies.name ? <Component {...rest} /> : <Navigate to='/' />;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp setToken={setToken} />} />
        <Route path="/recipes" element={<ProtectedRoute component={Recipes} setToken={setToken}/>} />
      </Routes>
    </div>
  );
}

export default App;
