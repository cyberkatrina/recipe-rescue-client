import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { Recipes } from "./components/Recipes";
import { FilterIngredients } from "./components/Filter";
import { Routes, Route, Navigate } from "react-router";

function App() {
  const [token, setToken] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearch] = useState("");


  useEffect(() => {
    if (token) {
      // Only make the request if the token is present
      const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:5000/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
           // Log the user data or handle it accordingly
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
  }, [token]);

  const ProtectedRoute = ({component: Component, ...rest}) => {
    return(
        token ? <Component {...rest}/> : <Navigate to='/login'/>
    )
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp setToken={setToken} />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/filter" element={<ProtectedRoute component={FilterIngredients}/>} />
      </Routes>
    </div>
  );
}

export default App;
