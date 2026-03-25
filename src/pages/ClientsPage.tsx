import { useEffect, useState } from "react";
import { fetchClients, type Client } from "../api";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchClients()
      .then(setClients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-subtitle">{clients.length} registered client(s)</p>
        </div>
        <button className="btn btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>OS</th>
              <th>OS Version</th>
              <th>Model</th>
              <th>Brand</th>
              <th>iPad</th>
              <th>TV</th>
              <th>API Key</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="state-msg">Loading…</td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={8} className="state-msg error-msg">{error}</td>
              </tr>
            )}
            {!loading && !error && clients.length === 0 && (
              <tr>
                <td colSpan={8} className="state-msg">No clients found.</td>
              </tr>
            )}
            {!loading && !error && clients.map((c) => (
              <tr key={c.id}>
                <td className="mono">{c.id}</td>
                <td>{c.metadata?.system_name ?? c.metadata?.platform ?? "—"}</td>
                <td>{c.metadata?.platform_version ?? "—"}</td>
                <td>{c.metadata?.model ?? "—"}</td>
                <td>{c.metadata?.brand ?? "—"}</td>
                <td>{c.metadata == null ? "—" : c.metadata.is_pad ? "Yes" : "No"}</td>
                <td>{c.metadata == null ? "—" : c.metadata.is_tv ? "Yes" : "No"}</td>
                <td className="mono">{c.api_key}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
