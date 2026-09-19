// Save token to localStorage
export function saveToken(token: string) {
    localStorage.setItem('gainz_token', token)
}

// Get token from localStorage
export function getToken(): string | null {
    return localStorage.getItem('gainz_token')
}

// Remove token from localStorage
export function removeToken() {
    localStorage.removeItem('gainz_token')
}

// Build headers with Authorization token
export function authHeaders(): HeadersInit {
    const token = getToken()
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
}

// Build fetch options with credentials and auth headers
export function authFetchOptions(method: string = 'GET', body?: object) {
    return {
        method,
        headers: authHeaders(),
        credentials: 'include' as RequestCredentials,
        ...(body ? { body: JSON.stringify(body) } : {})
    }
}