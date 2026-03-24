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
              <th>API Key</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={2} className="state-msg">Loading…</td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={2} className="state-msg error-msg">{error}</td>
              </tr>
            )}
            {!loading && !error && clients.length === 0 && (
              <tr>
                <td colSpan={2} className="state-msg">No clients found.</td>
              </tr>
            )}
            {!loading && !error && clients.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td className="mono">{c.api_key}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
