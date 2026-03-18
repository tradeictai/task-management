import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// ============================================
// USEAUTH HOOK
// Access authentication state anywhere
// Phase 2: Authentication
// ============================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
