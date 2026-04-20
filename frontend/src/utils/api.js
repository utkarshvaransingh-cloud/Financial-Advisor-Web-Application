const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://financial-advisor-web-app.netlify.app'

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem('fa_auth')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeAuth(auth) {
  localStorage.setItem('fa_auth', JSON.stringify(auth))
}

export function clearStoredAuth() {
  localStorage.removeItem('fa_auth')
}

export async function apiRequest(path, { token, body, headers, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const error = new Error(payload?.error || 'Request failed')
    error.status = response.status
    throw error
  }

  return payload
}
