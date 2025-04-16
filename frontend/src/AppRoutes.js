import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import App from "./app";

const AppRoutes = () => {
  // ✅ Auth state is initialized immediately from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/main" : "/login"} />}
      />
      <Route
        path="/login"
        element={<LoginPage onAuth={() => setIsAuthenticated(true)} />}
      />
      <Route
        path="/signup"
        element={<SignupPage onAuth={() => setIsAuthenticated(true)} />}
      />
      <Route
        path="/main"
        element={isAuthenticated ? <App /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default AppRoutes;
