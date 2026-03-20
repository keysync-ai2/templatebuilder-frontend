/**
 * API service layer — fetch wrapper with JWT injection, auto-refresh, error handling.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ox9rvnsbm2.execute-api.us-east-1.amazonaws.com/prod';

// --- Token management ---

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function setTokens(access, refresh) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// --- Core fetch ---

async function apiFetch(path, options = {}) {
  const { body, method = 'GET', auth = true, ...rest } = options;

  const headers = { 'Content-Type': 'application/json', ...rest.headers };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try auto-refresh on 401
  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      const retry = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      return handleResponse(retry);
    }
    // Refresh failed — clear tokens
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error('Session expired');
  }

  return handleResponse(res);
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error?.message || data.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.code = data.error?.code;
    throw err;
  }
  return data;
}

async function tryRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access_token) {
      setTokens(data.access_token, data.refresh_token || refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// --- Auth API ---

export async function signup(email, password, name) {
  const data = await apiFetch('/api/auth/signup', {
    method: 'POST',
    body: { email, password, name },
    auth: false,
  });
  if (data.access_token) {
    setTokens(data.access_token, data.refresh_token);
  }
  return data;
}

export async function login(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  if (data.access_token) {
    setTokens(data.access_token, data.refresh_token);
  }
  return data;
}

export async function getMe() {
  return apiFetch('/api/auth/me');
}

export function logout() {
  clearTokens();
}

// --- Templates API ---

export async function listTemplates() {
  return apiFetch('/api/templates');
}

export async function getTemplate(id) {
  return apiFetch(`/api/templates/${id}`);
}

export async function getPublicTemplate(id) {
  return apiFetch(`/api/templates/public/${id}`, { auth: false });
}

export async function createTemplate(name, components, subject = '') {
  return apiFetch('/api/templates', {
    method: 'POST',
    body: { name, components, subject },
  });
}

export async function updateTemplate(id, updates) {
  return apiFetch(`/api/templates/${id}`, {
    method: 'PUT',
    body: updates,
  });
}

export async function deleteTemplate(id) {
  return apiFetch(`/api/templates/${id}`, { method: 'DELETE' });
}

// --- Chat API ---

export async function sendChatMessage(message, conversationId = null) {
  // Submit — returns {task_id, status: "pending"} immediately
  const task = await apiFetch('/api/chat', {
    method: 'POST',
    body: { message, conversation_id: conversationId },
  });

  console.log('[Chat] Task submitted:', task);

  const taskId = task.task_id;
  if (!taskId) {
    // Fallback: old sync response format
    return {
      conversation_id: task.conversation_id,
      message: task.message || '',
      widgets: task.widgets || [],
    };
  }

  // Poll until completed or failed
  const maxAttempts = 100; // 5 minutes at 3s intervals
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 3000));

    const result = await apiFetch(`/api/chat/status/${taskId}`);
    console.log(`[Chat] Poll ${i + 1}:`, result.status);

    if (result.status === 'completed') {
      return {
        conversation_id: result.conversation_id,
        message: result.message || '',
        widgets: result.widgets || [],
      };
    }

    if (result.status === 'failed') {
      throw new Error(result.error || 'Chat request failed');
    }
  }

  throw new Error('Request timed out after 5 minutes');
}

export async function listConversations() {
  return apiFetch('/api/conversations');
}

export async function getConversation(id) {
  return apiFetch(`/api/conversations/${id}`);
}

export async function deleteConversation(id) {
  return apiFetch(`/api/conversations/${id}`, { method: 'DELETE' });
}

// --- Presets API ---

export async function listPresets(category = null) {
  const params = category ? `?category=${category}` : '';
  return apiFetch(`/api/presets${params}`, { auth: false });
}

export async function getPreset(presetId) {
  return apiFetch(`/api/presets/${presetId}`, { auth: false });
}

// --- Render API ---

export async function renderTemplate(template) {
  return apiFetch('/api/render', {
    method: 'POST',
    body: { template },
  });
}

export async function exportTemplate(template) {
  return apiFetch('/api/render/export', {
    method: 'POST',
    body: { template },
  });
}
