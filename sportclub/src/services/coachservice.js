const API_URL = "http://localhost:3000/api/coach"

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

export async function getMyClasses() {
    const response = await fetch(`${API_URL}/my-classes`, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener mis clases")
    }

    return data
}

export async function getMySchedules() {
    const response = await fetch(`${API_URL}/my-schedules`, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener mi horario")
    }

    return data
}

