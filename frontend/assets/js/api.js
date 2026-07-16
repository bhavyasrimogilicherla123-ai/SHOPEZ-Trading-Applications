const api = {
  token: localStorage.getItem('shopez_token'),
  async request(path, options = {}) {
    const response = await fetch(`/api${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}), ...options.headers } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error?.message || 'Request failed.');
    return body;
  },
  get: (path) => api.request(path),
  post: (path, data) => api.request(path, { method: 'POST', body: JSON.stringify(data) }),
};
