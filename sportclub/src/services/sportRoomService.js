const API_URL = "http://localhost:3000/api/sport-rooms"

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

export async function getSportRooms() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener asignaciones")
    }

    return data
}

export async function createSportRoom(assignmentData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(assignmentData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al crear asignación")
    }

    return data
}

export async function updateSportRoom(sportRoomId, assignmentData) {
    const response = await fetch(`${API_URL}/${sportRoomId}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(assignmentData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar asignación")
    }

    return data
}

export async function deleteSportRoom(sportRoomId) {
    const response = await fetch(`${API_URL}/${sportRoomId}`, {
        method: "DELETE",
        headers: getHeader()
    })

    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Error al eliminar asignación")
    }

    return true
}