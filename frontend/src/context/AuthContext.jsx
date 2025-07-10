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
  const apiUrl = process.env.REACT_APP_API_URL;

  const loginUser = async (username, password) => {
    try {
      const response = await fetch(`${apiUrl}/users/login/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      if (data.access) {
        Cookies.set("access_token", data.access, { sameSite: "Lax" });
      }
      if (data.refresh) {
        Cookies.set("refresh_token", data.refresh, { sameSite: "Lax" });
      }

      setUser(data.username);
      setUsername(data.username);
      return { success: true, data: data.username };
    } catch (error) {
      console.error("Login error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const registerUser = async (full_name, username, email, password) => {
    try {
      const response = await fetch(`${apiUrl}/users/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name, username, email, password }),
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
      const response = await fetch(`${apiUrl}/users/users/`, {
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

  // Inside AuthProvider in AuthContext.js

  const updateProfile = async (full_name, username, email) => {
    try {
      const response = await fetch(
        `${apiUrl}/users/update-profile/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ full_name, username, email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Profile update error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    try {
      const response = await fetch(
        `${apiUrl}/users/change-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      return { success: true };
    } catch (error) {
      console.error("Password change error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const logoutUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/logout/`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Logout failed");
      }

      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      setUser(null);
      setUsername("");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error.message);
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
      value={{
        user,
        loginUser,
        registerUser,
        username,
        users,
        fetchAllUsers,
        changePassword,
        updateProfile,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
