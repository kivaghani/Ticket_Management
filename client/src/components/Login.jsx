import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [jwtDecode, setJwtDecode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    import('jwt-decode').then((module) => {
      setJwtDecode(() => module.default);
    }).catch((err) => {
      console.error("Failed to load jwt-decode:", err);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);

        if (jwtDecode) {
          const decodedToken = jwtDecode(response.data.token);
          if (decodedToken.role === 'admin') {
            navigate("/admindashboard");
          } else if (decodedToken.role === 'user') {
            navigate("/userdashboard");
          }
        }
      } else {
        setMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setMessage(error.response.data.message || "An error occurred during login.");
      } else {
        setMessage("An error occurred during login.");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
