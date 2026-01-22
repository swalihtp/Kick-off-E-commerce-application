import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          role: parsedUser.role.toLowerCase().trim(),
        });
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    if (userData.status === "blocked") {
      alert("Your account is blocked");
      return;
    }

    const normalizedUser = {
      ...userData,
      role: userData.role.toLowerCase().trim(),
    };

    setUser(normalizedUser);
    localStorage.setItem("userEmail", normalizedUser.email);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const logout = () => {
    api.post(`accounts/logout/`,{refresh:localStorage.getItem('refresh')})
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");

  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
