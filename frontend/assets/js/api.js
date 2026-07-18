const api = {
  token: localStorage.getItem("shopez_token"),

  async request(path, options = {}) {
    // Use the same server when opened at port 5000. When this file is opened
    // through a development preview/Live Server, call the backend explicitly.
    const apiBase = window.location.port === "5000" ? "" : "http://localhost:5000";
    const response = await fetch(`${apiBase}/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.token
          ? { Authorization: `Bearer ${this.token}` }
          : {}),
        ...options.headers,
      },
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.error?.message || "Request failed.");
    }

    return body;
  },

  get(path) {
    return this.request(path);
  },

  post(path, data) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
