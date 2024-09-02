import React from "react";
import { Navigate } from "react-router-dom";

function parseJwt(token) {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
}

function ProtectedRoute({ element: Component, ...rest }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = parseJwt(token);

  if (!decodedToken) {
    return <Navigate to="/login" />;
  }

  if (decodedToken.role === 'admin' && rest.path === '/admindashboard') {
    return <Component {...rest} />;
  } else if (decodedToken.role === 'user' && rest.path === '/userdashboard') {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
