import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import ClientsPage from "./pages/ClientsPage";
import RecordingsPage from "./pages/RecordingsPage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <span className="logo">VizoTV Backoffice</span>
        <nav className="nav">
          <NavLink to="/clients" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
            Clients
          </NavLink>
          <NavLink to="/recordings" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
            Recordings
          </NavLink>
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
