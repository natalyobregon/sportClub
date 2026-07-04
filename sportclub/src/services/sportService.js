const API_URL = "http://localhost:3000/api/sports"

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

export async function getSports() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener deportes")
    }

    return data
}

export async function createSport(sportData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(sportData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al crear deporte")
    }

    return data
}

export async function updateSport(sportId, sportData) {
    const response = await fetch(`${API_URL}/${sportId}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(sportData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar deporte")
    }

    return data
}

export async function deleteSport(sportId) {
    const response = await fetch(`${API_URL}/${sportId}`, {
        method: "DELETE",
        headers: getHeader()
    })

    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Error al eliminar deporte")
    }

    return true
}

export async function changeSportStatus(sportId, status) {
    const response = await fetch(`${API_URL}/${sportId}/status`, {
        method: "PATCH",
        headers: getHeader(),
        body: JSON.stringify({ status })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al cambiar el estado del deporte")
    }

    return data
}
