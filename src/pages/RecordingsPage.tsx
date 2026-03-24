import { useEffect, useState } from "react";
import { fetchRecordings, fetchClients, type Recording, type Client } from "../api";

const STATUS_OPTIONS = ["", "recording", "completed", "failed", "stopping", "expired"];

function formatBytes(n: number | null) {
  if (n == null) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function formatDuration(secs: number | null) {
  if (secs == null) return "—";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterClient, setFilterClient] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchRecordings({ client_id: filterClient || undefined, status: filterStatus || undefined }),
      fetchClients(),
    ])
      .then(([data, cls]) => {
        setRecordings(data.recordings);
        setClients(cls);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filterClient, filterStatus]);

  const visible = recordings.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.channel_name ?? "").toLowerCase().includes(q) ||
      r.client_id.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Recordings</h1>
          <p className="page-subtitle">{visible.length} recording(s)</p>
        </div>
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search title, channel, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)}>
            <option value="">All clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.id}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s || "All statuses"}</option>
            ))}
          </select>
          <button className="btn btn-ghost" onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Status</th>
              <th>Channel</th>
              <th>Duration</th>
              <th>Size</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Downloaded</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} className="state-msg">Loading…</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={9} className="state-msg error-msg">{error}</td></tr>
            )}
            {!loading && !error && visible.length === 0 && (
              <tr><td colSpan={9} className="state-msg">No recordings found.</td></tr>
            )}
            {!loading && !error && visible.map((r) => (
              <tr key={`${r.client_id}:${r.id}`}>
                <td>
                  <div style={{ fontWeight: 500, color: "#f4f4f5" }}>{r.title}</div>
                  <div className="mono" style={{ fontSize: "0.75rem" }}>{r.id}</div>
                  {r.error && (
                    <div style={{ color: "#f87171", fontSize: "0.75rem", marginTop: 2 }}>{r.error}</div>
                  )}
                </td>
                <td className="mono">{r.client_id}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>{r.channel_name ?? "—"}</td>
                <td>{formatDuration(r.actual_duration ?? r.duration)}</td>
                <td>{formatBytes(r.file_size)}</td>
                <td style={{ whiteSpace: "nowrap" }}>{formatDate(r.created_at)}</td>
                <td style={{ whiteSpace: "nowrap" }}>{formatDate(r.expires_at)}</td>
                <td>{r.downloaded ? <span style={{ color: "#4ade80" }}>Yes</span> : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
