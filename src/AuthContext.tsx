import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { SERVER_URL } from "./config";
import { setUnauthorizedHandler } from "./api";

const TOKEN_KEY = "backoffice_token";

interface AuthContextValue {
  token: string | null;
  login: (code: string, redirectUri: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, []);

  async function login(code: string, redirectUri: string) {
    const res = await fetch(`${SERVER_URL}/api/backoffice/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail ?? "Login failed");
    }
    const { access_token } = await res.json();
    localStorage.setItem(TOKEN_KEY, access_token);
    setToken(access_token);
  }

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
