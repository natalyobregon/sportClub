const API_URL = "http://localhost:3000/api/auth/"

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

export async function getProfile() {
    const response = await fetch(`${API_URL}me`, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener el perfil")
    }

    return data
}

export async function updateProfile(profileData) {
    const response = await fetch(`${API_URL}me`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(profileData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el perfil")
    }

    return data
}

export async function changeMyPassword(passwordData) {
    const response = await fetch(`${API_URL}me/password`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(passwordData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al cambiar la contraseña")
    }

    return data
}