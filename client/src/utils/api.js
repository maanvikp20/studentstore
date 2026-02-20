const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` })
});

const getMultipartHeaders = (token) => ({
  ...(token && { Authorization: `Bearer ${token}` })
});

export const authAPI = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  updateProfile: async (token, data) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  changePassword: async (token, data) => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export const inventoryAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/inventory`);
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/inventory/${id}`);
    return response.json();
  },

  // imageFile: File object (optional). Falls back to data.imageURL if not provided.
  create: async (token, data, imageFile = null) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v != null) fd.append(k, v); });
    if (imageFile) fd.append('image', imageFile);
    const response = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: getMultipartHeaders(token),
      body: fd
    });
    return response.json();
  },

  update: async (token, id, data, imageFile = null) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v != null) fd.append(k, v); });
    if (imageFile) fd.append('image', imageFile);
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: getMultipartHeaders(token),
      body: fd
    });
    return response.json();
  },

  delete: async (token, id) => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return response.json();
  }
};

export const ordersAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/orders`, { headers: getAuthHeaders(token) });
    return response.json();
  },

  getById: async (token, id) => {
    const response = await fetch(`${API_URL}/orders/${id}`, { headers: getAuthHeaders(token) });
    return response.json();
  },

  create: async (token, data) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  update: async (token, id, data) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  delete: async (token, id) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return response.json();
  }
};

export const customOrdersAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/custom-orders`, { headers: getAuthHeaders(token) });
    return response.json();
  },

  getById: async (token, id) => {
    const response = await fetch(`${API_URL}/custom-orders/${id}`, { headers: getAuthHeaders(token) });
    return response.json();
  },

  create: async (token, data, modelFile = null) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v != null) fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v);
    });
    if (modelFile) fd.append('file', modelFile);
    const response = await fetch(`${API_URL}/custom-orders`, {
      method: 'POST',
      headers: getMultipartHeaders(token),
      body: fd
    });
    return response.json();
  },

  // XHR-based create with upload progress tracking
  createWithProgress: (token, data, modelFile, onProgress) =>
    new Promise((resolve, reject) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v != null) fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v);
      });
      if (modelFile) fd.append('file', modelFile);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener('load', () => {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch { reject(new Error('Invalid server response')); }
      });
      xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
      xhr.open('POST', `${API_URL}/custom-orders`);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(fd);
    }),

  update: async (token, id, data) => {
    const response = await fetch(`${API_URL}/custom-orders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  delete: async (token, id) => {
    const response = await fetch(`${API_URL}/custom-orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return response.json();
  }
};

export const testimonialsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/testimonials`);
    return response.json();
  },

  create: async (token, data) => {
    const response = await fetch(`${API_URL}/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  update: async (token, id, data) => {
    const response = await fetch(`${API_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  delete: async (token, id) => {
    const response = await fetch(`${API_URL}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return response.json();
  }
};

export const usersAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/users`, { headers: getAuthHeaders(token) });
    return response.json();
  },

  updateRole: async (token, id, role) => {
    const response = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ role })
    });
    return response.json();
  },

  delete: async (token, id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return response.json();
  }
};