import { useEffect, useState } from "react"
import { Button, Card, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import ReservationModal from "../../componentes/reservations/ReservationModal"
import { getAvailableClasses } from "../../services/MemberService"
import { createReservation } from "../../services/reservationService"
import { getDayLabel } from "../../utils/dayOfWeek"
import { IconActivity, IconClock } from "../../componentes/ui/Icons"

function AvailableClassesPage() {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedClass, setSelectedClass] = useState(null)

    const loadClasses = async () => {
        try {
            setLoading(true)
            const data = await getAvailableClasses()
            setClasses(data.data || data)
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadClasses()
    }, [])

    const openReserveModal = (sportRoomClass) => {
        setSelectedClass(sportRoomClass)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedClass(null)
    }

    const handleReserve = async (reservationData) => {
        try {
            await createReservation(reservationData)
            Swal.fire("Reservado", "Tu reserva se creó correctamente", "success")
            closeModal()
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        }
    }

    return (
        <Card className="card-modern">
            <Card.Header>
                <h4 className="mb-0" style={{ fontWeight: 700 }}>Clases Disponibles</h4>
                <div className="small text-muted">{classes.length} clases con cupo</div>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando clases disponibles...</p>
                    </div>
                ) : classes.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        <IconActivity size={28} />
                        <p className="mt-2 mb-0">No hay clases disponibles por el momento.</p>
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Deporte</th>
                                    <th>Sala</th>
                                    <th>Coach</th>
                                    <th>Horarios</th>
                                    <th style={{ textAlign: "right" }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="avatar-badge"
                                                    style={{ background: "#E8EEFB", color: "#1D4ED8" }}
                                                >
                                                    <IconActivity size={14} />
                                                </div>
                                                <span>{item.sport?.name}</span>
                                            </div>
                                        </td>
                                        <td>{item.room?.name}</td>
                                        <td className="text-muted">{item.coach?.full_name || item.coach?.email}</td>
                                        <td>
                                            {(item.schedules || []).length === 0 ? (
                                                <span className="text-muted small">Sin horarios</span>
                                            ) : (
                                                <div className="d-flex flex-wrap gap-1">
                                                    {item.schedules.map((schedule) => (
                                                        <span key={schedule.id} className="status-pill status-pill-inactive">
                                                            <IconClock size={11} /> {getDayLabel(schedule.day_of_week)}{" "}
                                                            {schedule.start_time?.substring(0, 5)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <Button
                                                size="sm"
                                                className="btn-brand-primary"
                                                disabled={(item.schedules || []).length === 0}
                                                onClick={() => openReserveModal(item)}
                                            >
                                                Reservar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card.Body>

            <ReservationModal
                show={showModal}
                handleClose={closeModal}
                handleSave={handleReserve}
                sportRoomClass={selectedClass}
            />
        </Card>
    )
}

export default AvailableClassesPage