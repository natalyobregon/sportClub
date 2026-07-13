import { useEffect, useState } from "react"
import { Card, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { cancelReservation, getMyReservations } from "../../services/reservationService"
import { getDayLabel } from "../../utils/dayOfWeek"
import { IconClipboard, IconActivity } from "../../componentes/ui/Icons"

function MyReservationsPage() {
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)

    const loadReservations = async () => {
        try {
            setLoading(true)
            const data = await getMyReservations()
            setReservations(data.data || data)
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadReservations()
    }, [])

    const handleCancel = async (reservation) => {
        const result = await Swal.fire({
            title: "¿Cancelar reserva?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "Volver",
            confirmButtonColor: "#d33",
        })

        if (result.isConfirmed) {
            try {
                await cancelReservation(reservation.id)
                Swal.fire("Cancelada", "Tu reserva fue cancelada", "success")
                loadReservations()
            } catch (error) {
                Swal.fire("Error", error.message, "error")
            }
        }
    }

    return (
        <Card className="card-modern">
            <Card.Header>
                <h4 className="mb-0" style={{ fontWeight: 700 }}>Mis Reservas</h4>
                <div className="small text-muted">{reservations.length} reservas totales</div>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando mis reservas...</p>
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        <IconClipboard size={28} />
                        <p className="mt-2 mb-0">Aún no tienes reservas.</p>
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Deporte</th>
                                    <th>Sala</th>
                                    <th>Día</th>
                                    <th>Horario</th>
                                    <th>Estado</th>
                                    <th style={{ textAlign: "right" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((reservation) => {
                                    const schedule = reservation.classSchedule
                                    const sportRoom = schedule?.sportRoom

                                    return (
                                        <tr key={reservation.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div
                                                        className="avatar-badge"
                                                        style={{ background: "#E8EEFB", color: "#1D4ED8" }}
                                                    >
                                                        <IconActivity size={14} />
                                                    </div>
                                                    <span>{sportRoom?.sport?.name}</span>
                                                </div>
                                            </td>
                                            <td>{sportRoom?.room?.name}</td>
                                            <td className="text-muted">{getDayLabel(schedule?.day_of_week)}</td>
                                            <td className="text-muted">
                                                {schedule?.start_time?.substring(0, 5)} -{" "}
                                                {schedule?.end_time?.substring(0, 5)}
                                            </td>
                                            <td>
                                                <span className={reservation.status === "active" ? "status-pill status-pill-active" : "status-pill status-pill-inactive"}>
                                                    {reservation.status === "active" ? "Activa" : "Cancelada"}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                {reservation.status === "active" && (
                                                    <button
                                                        type="button"
                                                        className="icon-action-btn danger"
                                                        onClick={() => handleCancel(reservation)}
                                                        aria-label="Cancelar reserva"
                                                        title="Cancelar"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default MyReservationsPage
