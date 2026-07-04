const API_URL = "http://localhost:3000/api/rooms"

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

export async function getRooms() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener salas")
    }

    return data
}

export async function createRoom(roomData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(roomData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al crear sala")
    }

    return data
}

export async function updateRoom(roomId, roomData) {
    const response = await fetch(`${API_URL}/${roomId}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(roomData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar sala")
    }

    return data
}

export async function deleteRoom(roomId) {
    const response = await fetch(`${API_URL}/${roomId}`, {
        method: "DELETE",
        headers: getHeader()
    })

    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Error al eliminar sala")
    }

    return true
}
