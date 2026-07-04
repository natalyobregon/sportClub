import { useEffect, useState } from "react"
import { Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import ReservationModal from "../../componentes/reservations/ReservationModal"
import { getAvailableClasses } from "../../services/memberService"
import { createReservation } from "../../services/reservationService"
import { getDayLabel } from "../../utils/dayOfWeek"

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

    if (loading) {
        return (
            <div className="text-center p-4">
                <Spinner animation="border" />
                <p className="mt-2">Cargando clases disponibles...</p>
            </div>
        )
    }

    return (
        <>
            <h4 className="mb-3">Clases Disponibles</h4>

            {classes.length === 0 ? (
                <p>No hay clases disponibles por el momento.</p>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-3">
                    {classes.map((item) => (
                        <Col key={item.id}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{item.sport?.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Sala: {item.room?.name}
                                    </Card.Subtitle>
                                    <Card.Text className="small">
                                        Coach: {item.coach?.full_name || item.coach?.email}
                                    </Card.Text>

                                    <div className="mb-3">
                                        {(item.schedules || []).length === 0 ? (
                                            <span className="text-muted small">
                                                Sin horarios disponibles.
                                            </span>
                                        ) : (
                                            item.schedules.map((schedule) => (
                                                <Badge
                                                    bg="secondary"
                                                    className="me-2 mb-2"
                                                    key={schedule.id}
                                                >
                                                    {getDayLabel(schedule.day_of_week)}{" "}
                                                    {schedule.start_time?.substring(0, 5)}
                                                </Badge>
                                            ))
                                        )}
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="sm"
                                        disabled={(item.schedules || []).length === 0}
                                        onClick={() => openReserveModal(item)}
                                    >
                                        Reservar
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <ReservationModal
                show={showModal}
                handleClose={closeModal}
                handleSave={handleReserve}
                sportRoomClass={selectedClass}
            />
        </>
    )
}

export default AvailableClassesPage