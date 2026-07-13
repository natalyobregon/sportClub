import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { getMyReservations } from "../../services/reservationService"
import { getAvailableClasses } from "../../services/MemberService"
import { getDayLabel } from "../../utils/dayOfWeek"

function UserDashboard() {
    const [activeCount, setActiveCount] = useState("-")
    const [classesCount, setClassesCount] = useState("-")
    const [reservations, setReservations] = useState([])
    const [availableClasses, setAvailableClasses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true)
                const [reservationsRes, classesRes] = await Promise.all([
                    getMyReservations(),
                    getAvailableClasses(),
                ])
                const reservationsList = reservationsRes.data || reservationsRes
                const classesList = classesRes.data || classesRes

                setActiveCount(reservationsList.filter((r) => r.status === "active").length)
                setClassesCount(classesList.length)
                setReservations(reservationsList.slice(0, 5))
                setAvailableClasses(classesList.slice(0, 5))
            } catch {
                // Si alguna estadística falla, el dashboard igual se muestra con "-"
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    return (
        <div className="split-bg" style={{ borderRadius: "12px" }}>
            <div className="split-bg-a" style={{ background: "var(--role-user-a)" }}></div>
            <div className="split-bg-b" style={{ background: "var(--role-user-b)" }}></div>

            <div className="split-content" style={{ padding: "32px 28px" }}>
                <div className="small text-white mb-2" style={{ opacity: 0.75, letterSpacing: "1px" }}>MI CUENTA</div>

                <h1 className="brand-heading text-white" style={{ fontSize: "32px" }}>
                    Usuario
                </h1>
                <p className="text-white mb-4" style={{ opacity: 0.9, maxWidth: "460px" }}>
                    Mis reservas, clases disponibles y mi perfil.
                </p>

                <Row className="g-3 mb-4">
                    <Col xs={6} md={4}>
                        <div className="bg-white rounded p-3 text-center h-100">
                            <div className="fw-bold fs-3" style={{ color: "var(--role-user-a)" }}>{activeCount}</div>
                            <div className="small text-muted">reservas activas</div>
                        </div>
                    </Col>
                    <Col xs={6} md={4}>
                        <div className="rounded p-3 text-center h-100" style={{ backgroundColor: "var(--brand-ink)" }}>
                            <div className="fw-bold fs-3 text-white">{classesCount}</div>
                            <div className="small text-white">clases disponibles</div>
                        </div>
                    </Col>
                </Row>

                {!loading && (
                    <Row className="g-3">
                        <Col md={6}>
                            <div className="bg-white rounded p-3 h-100">
                                <div className="fw-semibold mb-2" style={{ fontSize: "13px" }}>Mis reservas</div>
                                {reservations.length === 0 ? (
                                    <div className="small text-muted">Aún no tienes reservas.</div>
                                ) : (
                                    <div className="table-scroll">
                                        <table className="table-modern" style={{ fontSize: "13px" }}>
                                            <thead>
                                                <tr>
                                                    <th>Clase</th>
                                                    <th>Horario</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reservations.map((r) => (
                                                    <tr key={r.id}>
                                                        <td>{r.classSchedule?.sportRoom?.sport?.name || "-"}</td>
                                                        <td className="text-muted">
                                                            {r.classSchedule?.day_of_week ? getDayLabel(r.classSchedule.day_of_week) : "-"}{" "}
                                                            {r.classSchedule?.start_time?.substring(0, 5)}
                                                        </td>
                                                        <td>
                                                            <span className={r.status === "active" ? "status-pill status-pill-active" : "status-pill status-pill-inactive"}>
                                                                {r.status === "active" ? "Activa" : r.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="bg-white rounded p-3 h-100">
                                <div className="fw-semibold mb-2" style={{ fontSize: "13px" }}>Clases disponibles</div>
                                {availableClasses.length === 0 ? (
                                    <div className="small text-muted">No hay clases disponibles por ahora.</div>
                                ) : (
                                    <div className="table-scroll">
                                        <table className="table-modern" style={{ fontSize: "13px" }}>
                                            <thead>
                                                <tr>
                                                    <th>Deporte</th>
                                                    <th>Sala</th>
                                                    <th>Coach</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {availableClasses.map((c) => (
                                                    <tr key={c.id}>
                                                        <td>{c.sport?.name}</td>
                                                        <td>{c.room?.name}</td>
                                                        <td className="text-muted">{c.coach?.full_name || "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    )
}

export default UserDashboard