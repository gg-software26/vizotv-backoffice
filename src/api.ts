import { SERVER_URL } from "./config";

const TOKEN_KEY = "backoffice_token";

let _onUnauthorized: (() => void) | null = null;

/** Called once by AuthProvider so the API layer can trigger logout on 401. */
export function setUnauthorizedHandler(fn: () => void) {
  _onUnauthorized = fn;
}

const headers = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

function handleUnauthorized(): never {
  _onUnauthorized?.();
  throw new Error("401");
}

export interface ClientMetadata {
  platform?: string;
  platform_version?: string | number;
  is_pad?: boolean;
  is_tv?: boolean;
  model?: string;
  brand?: string;
  system_name?: string;
}

export interface Client {
  id: string;
  api_key: string;
  metadata: ClientMetadata | null;
}

export interface Recording {
  id: string;
  client_id: string;
  title: string;
  channel_name: string | null;
  channel_logo: string | null;
  status: "queued" | "recording" | "completed" | "failed" | "stopping" | "expired" | "deleted";
  file_name: string | null;
  file_size: number | null;
  duration: number | null;
  actual_duration: number | null;
  created_at: string;
  completed_at: string | null;
  error: string | null;
  expires_at: string | null;
  downloaded: boolean;
  downloaded_at: string | null;
}

export async function fetchClients(): Promise<Client[]> {
  const res = await fetch(`${SERVER_URL}/api/backoffice/clients`, { headers: headers() });
  if (res.status === 401) handleUnauthorized();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchRecordings(params?: {
  client_id?: string;
  status?: string;
}): Promise<{ recordings: Recording[]; total: number }> {
  const url = new URL(`${SERVER_URL}/api/backoffice/recordings`);
  if (params?.client_id) url.searchParams.set("client_id", params.client_id);
  if (params?.status) url.searchParams.set("status", params.status);
  const res = await fetch(url.toString(), { headers: headers() });
  if (res.status === 401) handleUnauthorized();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
