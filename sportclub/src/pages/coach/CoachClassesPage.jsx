import { useEffect, useState } from "react"
import { Badge, Card, Col, Row, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMyClasses } from "../../services/coachService"
import { getDayLabel } from "../../utils/dayOfWeek"

function CoachClassesPage() {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)

    const loadClasses = async () => {
        try {
            setLoading(true)
            const data = await getMyClasses()
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

    if (loading) {
        return (
            <div className="text-center p-4">
                <Spinner animation="border" />
                <p className="mt-2">Cargando mis clases...</p>
            </div>
        )
    }

    return (
        <>
            <h4 className="mb-3">Mis Clases</h4>

            {classes.length === 0 ? (
                <p>Aún no tienes clases asignadas.</p>
            ) : (
                <Row xs={1} md={2} className="g-3">
                    {classes.map((item) => (
                        <Col key={item.id}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{item.sport?.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Sala: {item.room?.name}
                                    </Card.Subtitle>

                                    {item.observation && (
                                        <Card.Text className="small text-muted">
                                            {item.observation}
                                        </Card.Text>
                                    )}

                                    <div className="mt-2">
                                        {(item.schedules || []).length === 0 ? (
                                            <span className="text-muted small">
                                                Sin horarios asignados aún.
                                            </span>
                                        ) : (
                                            item.schedules.map((schedule) => (
                                                <Badge
                                                    bg="info"
                                                    className="me-2 mb-2"
                                                    key={schedule.id}
                                                >
                                                    {getDayLabel(schedule.day_of_week)}{" "}
                                                    {schedule.start_time?.substring(0, 5)} -{" "}
                                                    {schedule.end_time?.substring(0, 5)}
                                                </Badge>
                                            ))
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </>
    )
}

export default CoachClassesPage