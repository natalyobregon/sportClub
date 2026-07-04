import { useEffect, useState } from "react"
import { Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMySchedules } from "../../services/coachService"
import { getDayLabel } from "../../utils/dayOfWeek"

function CoachSchedulePage() {
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)

    const loadSchedules = async () => {
        try {
            setLoading(true)
            const data = await getMySchedules()
            setSchedules(data.data || data)
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSchedules()
    }, [])

    return (
        <Card className="shadow-sm">
            <Card.Header>
                <h4 className="mb-0">Mi Horario</h4>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando mi horario...</p>
                    </div>
                ) : schedules.length === 0 ? (
                    <p>Aún no tienes horarios asignados.</p>
                ) : (
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>Día</th>
                                <th>Inicio</th>
                                <th>Término</th>
                                <th>Deporte</th>
                                <th>Sala</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule) => (
                                <tr key={schedule.id}>
                                    <td>{getDayLabel(schedule.day_of_week)}</td>
                                    <td>{schedule.start_time?.substring(0, 5)}</td>
                                    <td>{schedule.end_time?.substring(0, 5)}</td>
                                    <td>{schedule.sportRoom?.sport?.name}</td>
                                    <td>{schedule.sportRoom?.room?.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    )
}

export default CoachSchedulePage