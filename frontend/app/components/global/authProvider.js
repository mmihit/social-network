"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();

  const fetchWithAuth = async (url, method = "GET", body = null) => {
    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        body:body,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(data.error_message || "Unknown error");
      }

      return data;
    } catch (err) {
      console.error("fetchWithAuth error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
