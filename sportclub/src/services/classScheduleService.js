const API_URL = "http://localhost:3000/api/class-schedules"

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

export async function getClassSchedules() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener horarios")
    }

    return data
}

export async function createClassSchedule(scheduleData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(scheduleData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al crear horario")
    }

    return data
}

export async function updateClassSchedule(scheduleId, scheduleData) {
    const response = await fetch(`${API_URL}/${scheduleId}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(scheduleData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar horario")
    }

    return data
}

export async function deleteClassSchedule(scheduleId) {
    const response = await fetch(`${API_URL}/${scheduleId}`, {
        method: "DELETE",
        headers: getHeader()
    })

    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Error al eliminar horario")
    }

    return true
}