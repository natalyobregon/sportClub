const API_URL = "http://localhost:3000/api/reservations"

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

export async function getAllReservations() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener las reservas")
    }

    return data
}

export async function getMyReservations() {
    const response = await fetch(`${API_URL}/my-reservations`, {
        method: "GET",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener mis reservas")
    }

    return data
}

export async function createReservation(reservationData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(reservationData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al crear la reserva")
    }

    return data
}

export async function cancelReservation(reservationId) {
    const response = await fetch(`${API_URL}/${reservationId}/cancel`, {
        method: "PATCH",
        headers: getHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Error al cancelar la reserva")
    }

    return data
}