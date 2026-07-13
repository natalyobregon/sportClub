import { useEffect, useState } from "react"
import { Card, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMyClasses } from "../../services/coachservice"
import { getDayLabel } from "../../utils/dayOfWeek"
import { IconActivity, IconWhistle } from "../../componentes/ui/Icons"

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

    return (
        <Card className="card-modern">
            <Card.Header>
                <h4 className="mb-0" style={{ fontWeight: 700 }}>Mis Clases</h4>
                <div className="small text-muted">{classes.length} clases asignadas</div>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando mis clases...</p>
                    </div>
                ) : classes.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        <IconWhistle size={28} />
                        <p className="mt-2 mb-0">Aún no tienes clases asignadas.</p>
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Deporte</th>
                                    <th>Sala</th>
                                    <th>Observación</th>
                                    <th>Horarios</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="avatar-badge"
                                                    style={{ background: "#E6F6EC", color: "#0F7A3D" }}
                                                >
                                                    <IconActivity size={14} />
                                                </div>
                                                <span>{item.sport?.name}</span>
                                            </div>
                                        </td>
                                        <td>{item.room?.name}</td>
                                        <td className="text-muted">{item.observation || "-"}</td>
                                        <td>
                                            {(item.schedules || []).length === 0 ? (
                                                <span className="text-muted small">Sin horarios asignados</span>
                                            ) : (
                                                <div className="d-flex flex-wrap gap-1">
                                                    {item.schedules.map((schedule) => (
                                                        <span key={schedule.id} className="status-pill status-pill-active">
                                                            {getDayLabel(schedule.day_of_week)}{" "}
                                                            {schedule.start_time?.substring(0, 5)}-{schedule.end_time?.substring(0, 5)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
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

export default CoachClassesPage