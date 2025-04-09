import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import App from "./app";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []); // Run once on app load

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
        element={
          isAuthenticated ? <App /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
