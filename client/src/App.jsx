import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div>         
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/userdashboard"
            element={<ProtectedRoute element={UserDashboard} path="/userdashboard" />}
          />
          <Route
            path="/admindashboard"
            element={<ProtectedRoute element={AdminDashboard} path="/admindashboard" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
