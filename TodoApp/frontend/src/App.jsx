import React, { useState } from "react";
import LoginRegister from "./components/LoginRegister";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated ? (
        <Dashboard setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <LoginRegister setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}
