import { useEffect, useState } from "react"
import { Card, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMySchedules } from "../../services/coachservice"
import { getDayLabel } from "../../utils/dayOfWeek"
import { IconClock } from "../../componentes/ui/Icons"

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
        <Card className="card-modern">
            <Card.Header>
                <h4 className="mb-0" style={{ fontWeight: 700 }}>Mi Horario</h4>
                <div className="small text-muted">{schedules.length} bloques asignados</div>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando mi horario...</p>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        <IconClock size={28} />
                        <p className="mt-2 mb-0">Aún no tienes horarios asignados.</p>
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Día</th>
                                    <th>Horario</th>
                                    <th>Deporte</th>
                                    <th>Sala</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td>
                                            <span className="status-pill status-pill-active">
                                                {getDayLabel(schedule.day_of_week)}
                                            </span>
                                        </td>
                                        <td>
                                            {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="avatar-badge"
                                                    style={{ background: "#E6F6EC", color: "#0F7A3D" }}
                                                >
                                                    <IconClock size={14} />
                                                </div>
                                                <span>{schedule.sportRoom?.sport?.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted">{schedule.sportRoom?.room?.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default CoachSchedulePage