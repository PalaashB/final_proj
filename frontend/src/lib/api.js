const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function fetchJSON(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }) },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.detail || data.message || "Request failed.";
    throw new Error(message);
  }
  return data;
}

export function getRecentItems(limit = 8) {
  return fetchJSON(`/api/items/recent?limit=${limit}`);
}

export function getStats() {
  return fetchJSON("/api/stats");
}

export function searchItems({ query, threshold, topK = 12, location }) {
  const params = new URLSearchParams({
    query,
    threshold: threshold.toString(),
    top_k: topK.toString()
  });
  if (location) params.set("location", location);
  return fetchJSON(`/api/search?${params.toString()}`);
}

export async function createItem(formData) {
  const response = await fetch(`${API_BASE_URL}/api/items`, {
    method: "POST",
    body: formData
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Upload failed.");
  }
  return data;
}

export { API_BASE_URL };