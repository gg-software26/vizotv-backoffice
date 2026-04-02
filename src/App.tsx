import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./AuthContext";
import { GOOGLE_CLIENT_ID } from "./config";
import ClientsPage from "./pages/ClientsPage";
import RecordingsPage from "./pages/RecordingsPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function ProtectedApp() {
  const { token, logout } = useAuth();

  if (!token) return <LoginPage />;

  return (
    <div className="app">
      <header className="header">
        <span className="logo">
          <img src="/favicon.png" alt="VizoTV" style={{ height: "28px", verticalAlign: "middle", marginRight: "8px" }} />
          VizoTV Backoffice
        </span>
        <nav className="nav">
          <NavLink to="/clients" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
            Clients
          </NavLink>
          <NavLink to="/recordings" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
            Recordings
          </NavLink>
          <button className="nav-btn" onClick={logout} style={{ marginLeft: "auto" }}>
            Logout
          </button>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route index element={<Navigate to="/clients" replace />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/recordings" element={<RecordingsPage />} />
          <Route path="*" element={<Navigate to="/clients" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ProtectedApp />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
