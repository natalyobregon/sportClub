const API_URL = "http://localhost:3000/api/member"

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

export async function getAvailableClasses() {
    const response = await fetch(`${API_URL}/classes`, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener clases disponibles")
    }

    return data
}