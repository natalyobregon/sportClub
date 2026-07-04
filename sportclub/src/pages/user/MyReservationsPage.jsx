import { useEffect, useState } from "react"
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { cancelReservation, getMyReservations } from "../../services/reservationService"
import { getDayLabel } from "../../utils/dayOfWeek"

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
        <Card className="shadow-sm">
            <Card.Header>
                <h4 className="mb-0">Mis Reservas</h4>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando mis reservas...</p>
                    </div>
                ) : reservations.length === 0 ? (
                    <p>Aún no tienes reservas.</p>
                ) : (
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>Deporte</th>
                                <th>Sala</th>
                                <th>Día</th>
                                <th>Horario</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => {
                                const schedule = reservation.classSchedule
                                const sportRoom = schedule?.sportRoom

                                return (
                                    <tr key={reservation.id}>
                                        <td>{sportRoom?.sport?.name}</td>
                                        <td>{sportRoom?.room?.name}</td>
                                        <td>{getDayLabel(schedule?.day_of_week)}</td>
                                        <td>
                                            {schedule?.start_time?.substring(0, 5)} -{" "}
                                            {schedule?.end_time?.substring(0, 5)}
                                        </td>
                                        <td>
                                            <Badge
                                                bg={
                                                    reservation.status === "active"
                                                        ? "success"
                                                        : "secondary"
                                                }
                                            >
                                                {reservation.status === "active"
                                                    ? "Activa"
                                                    : "Cancelada"}
                                            </Badge>
                                        </td>
                                        <td>
                                            {reservation.status === "active" && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleCancel(reservation)}
                                                >
                                                    Cancelar
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    )
}

export default MyReservationsPage