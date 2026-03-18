"use client";

// ============================================
// AUTH CONTEXT
// Global state for user authentication
// Phase 2: Authentication
// ============================================

import React, { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // Store token and user in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };

    case "LOGOUT":
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };

    case "RESTORE_TOKEN":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: !!action.payload.token,
        isLoading: false,
      };

    case "RESTORE_FINISHED":
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore token and user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch({
        type: "RESTORE_TOKEN",
        payload: {
          token,
          user: JSON.parse(user),
        },
      });
    } else {
      dispatch({ type: "RESTORE_FINISHED" });
    }
  }, []);

  const authContext = {
    ...state,
    login: (user, token) => {
      dispatch({
        type: "LOGIN",
        payload: { user, token },
      });
    },
    logout: () => {
      dispatch({ type: "LOGOUT" });
    },
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
