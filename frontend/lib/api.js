const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const { token, ...rest } = options
  const headers = { 'Content-Type': 'application/json', ...(rest.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(API + path, { ...rest, headers })
  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json() : await res.text()
  return { ok: res.ok, status: res.status, data }
}

export async function post(path, body, token) {
  return request(path, {
    method: 'POST',
    token,
    body: JSON.stringify(body)
  })
}

export async function get(path, token) {
  return request(path, { method: 'GET', token })
}

export async function put(path, body, token) {
  return request(path, {
    method: 'PUT',
    token,
    body: JSON.stringify(body)
  })
}

export async function patch(path, body, token) {
  return request(path, {
    method: 'PATCH',
    token,
    body: JSON.stringify(body)
  })
}

export async function del(path, token) {
  return request(path, {
    method: 'DELETE',
    token
  })
}

export default { API, get, post, put, patch, del }
