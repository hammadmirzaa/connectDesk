// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
const AuthContext = createContext();

export const UseAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const token = Cookies.get("access_token");

  const loginUser = async (username, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      const token = data.access;
      if (response.ok && data.access) {
        Cookies.set("access_token", data.access, { sameSite: "Lax" });
      }
      const user = data.username;

      localStorage.setItem("token", token);
      setUser(user);
      setUsername(data?.username);

      return { success: true, data: user };
    } catch (error) {
      console.error("Login error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setUser(data.user);

      return { success: true, data: data.user };
    } catch (error) {
      console.error("Signup error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/users/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Could not fetch users");
      }

      const data = await response.json();
      setUsers(data);
      return { success: true, data };
    } catch (error) {
      console.error("Fetch users error:", error.message);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllUsers();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, loginUser, registerUser, username, users, fetchAllUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
};
