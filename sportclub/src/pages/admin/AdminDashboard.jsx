import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { getUsers } from "../../services/userService"
import { getRooms } from "../../services/roomService"
import { getSportRooms } from "../../services/sportRoomService"
import { getAllReservations } from "../../services/reservationService"

function AdminDashboard() {
    const [stats, setStats] = useState({ users: "-", rooms: "-", assignments: "-", reservations: "-" })

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [users, rooms, assignments, reservations] = await Promise.all([
                    getUsers(),
                    getRooms(),
                    getSportRooms(),
                    getAllReservations(),
                ])
                setStats({
                    users: (users.data || users).length,
                    rooms: (rooms.data || rooms).length,
                    assignments: (assignments.data || assignments).length,
                    reservations: (reservations.data || reservations).length,
                })
            } catch (error) {
                // Si alguna estadística falla, el dashboard igual se muestra con "-"
            }
        }
        loadStats()
    }, [])

    return (
        <div className="split-bg" style={{ borderRadius: "12px" }}>
            <div className="split-bg-a" style={{ background: "var(--role-admin-a)" }}></div>
            <div className="split-bg-b" style={{ background: "var(--role-admin-b)" }}></div>

            <div className="split-content" style={{ padding: "32px 28px" }}>
                <div className="small text-white mb-2" style={{ opacity: 0.75, letterSpacing: "1px" }}>PANEL</div>

                <h1 className="brand-heading text-white" style={{ fontSize: "32px" }}>
                    Administrador
                </h1>
                <p className="text-white mb-4" style={{ opacity: 0.9, maxWidth: "460px" }}>
                    Gestión de usuarios, deportes, salas, asignaciones y horarios.
                </p>

                <Row className="g-3">
                    <Col xs={6} md={3}>
                        <div className="bg-white rounded p-3 text-center h-100">
                            <div className="fw-bold fs-3" style={{ color: "var(--role-admin-a)" }}>{stats.users}</div>
                            <div className="small text-muted">usuarios</div>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div className="bg-white rounded p-3 text-center h-100">
                            <div className="fw-bold fs-3" style={{ color: "var(--role-admin-a)" }}>{stats.rooms}</div>
                            <div className="small text-muted">salas</div>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div className="bg-white rounded p-3 text-center h-100">
                            <div className="fw-bold fs-3" style={{ color: "var(--role-admin-a)" }}>{stats.assignments}</div>
                            <div className="small text-muted">asignaciones</div>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div className="rounded p-3 text-center h-100" style={{ backgroundColor: "var(--brand-ink)" }}>
                            <div className="fw-bold fs-3 text-white">{stats.reservations}</div>
                            <div className="small text-white">reservas totales</div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default AdminDashboard