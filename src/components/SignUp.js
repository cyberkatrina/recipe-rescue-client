import React from "react"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const SignUp = (props) => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
      });
  
      // Check if the response contains a token
      if (res.data.token) {
        props.setToken(res.data.token); // Set the token received from the response
        document.cookie = `id=${res.data.id};max-age=60000`
        document.cookie = `name=${res.data.name};max-age=60000`
        document.cookie = `token=${res.data.token};max-age=60000`
        navigate("/recipes"); // Navigate to recipes upon successful sign-up
      } else {
        alert("Sign-up failed. Please try again."); // Alert if token is invalid
      }
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response.data); // Log the error response
        alert(err.response.data.message); // Show specific error message
      } else {
        console.error("Error:", err); // Log other types of errors
        alert("An error occurred during sign-up. Please check your details.");
      }
    }
  };  
  

  return (
    <div className="bg1">
      <h1 className="title1">Recipe Rescue</h1>
      <div className="form-container2">
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Name: 
            <input type='text' value={name} onChange={(e) => {setName(e.target.value)}} required/>
          </label>
          <label>
            Email: 
            <input type='email' value={email} onChange={(e) => {setEmail(e.target.value)}} required/>
          </label>
          <label>
            Password: 
            <input type='password' value={password} onChange={(e) => {setPassword(e.target.value)}} required/>
          </label>
          <input type="submit" value="Sign Up" />
        </form>
      </div>
    </div>
  )
}
