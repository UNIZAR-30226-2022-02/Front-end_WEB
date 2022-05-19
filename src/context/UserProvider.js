export function getUsername () {
    return localStorage.getItem('username')
}

export function getToken () {
    return localStorage.getItem('token')
}

export function login (username, token) {
    localStorage.setItem('username', username)
    localStorage.setItem('token', token)
}

export function logout () {
    localStorage.removeItem('username')
    localStorage.removeItem('token')
}
