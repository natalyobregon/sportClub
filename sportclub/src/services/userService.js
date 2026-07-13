const API_URL = "http://localhost:3000/api/users"

function getToken() {
    return localStorage.getItem("token")
}

function getHeader() {
    const token = getToken()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
}

export async function getUsers() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener usuarios")
    }

    return data
}

export async function createUser(userData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(userData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al crear usuario")
    }

    return data
}

export async function updateUser(userId, userData) {
    const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(userData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar usuario")
    }

    return data
}   

export async function deleteUser(Id) {
    const response = await fetch(`${API_URL}/${Id}`, {
        method: "DELETE",
        headers: getHeader()
    })

    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Error al eliminar usuario")
    }

    return true
}