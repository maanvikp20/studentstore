const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` })
});

// Auth API
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
  }
};

// Inventory API
export const inventoryAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/inventory`);
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/inventory/${id}`);
    return response.json();
  },

  create: async (token, data) => {
    const response = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  update: async (token, id, data) => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
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

// Orders API
export const ordersAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders(token)
    });
    return response.json();
  },

  getById: async (token, id) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: getAuthHeaders(token)
    });
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

// Custom Orders API
export const customOrdersAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/custom-orders`, {
      headers: getAuthHeaders(token)
    });
    return response.json();
  },

  getById: async (token, id) => {
    const response = await fetch(`${API_URL}/custom-orders/${id}`, {
      headers: getAuthHeaders(token)
    });
    return response.json();
  },

  create: async (token, data) => {
    const response = await fetch(`${API_URL}/custom-orders`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  },

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

// Testimonials API
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

// Users API (for admin)
export const usersAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders(token)
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