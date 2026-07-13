import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { getUsers } from "../../services/userService"
import { getRooms } from "../../services/roomService"
import { getSportRooms } from "../../services/sportRoomService"
import { getAllReservations } from "../../services/reservationService"

const ROLE_LABELS = { admin: "Administrador", coach: "Coach", user: "Usuario" }

function AdminDashboard() {
    const [stats, setStats] = useState({ users: "-", rooms: "-", assignments: "-", reservations: "-" })
    const [recentUsers, setRecentUsers] = useState([])
    const [recentReservations, setRecentReservations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true)
                const [users, rooms, assignments, reservations] = await Promise.all([
                    getUsers(),
                    getRooms(),
                    getSportRooms(),
                    getAllReservations(),
                ])
                const usersList = users.data || users
                const reservationsList = reservations.data || reservations

                setStats({
                    users: usersList.length,
                    rooms: (rooms.data || rooms).length,
                    assignments: (assignments.data || assignments).length,
                    reservations: reservationsList.length,
                })

                // Se muestran los 5 registros más recientes (mismos datos que ya trae el backend)
                setRecentUsers(usersList.slice(-5).reverse())
                setRecentReservations(reservationsList.slice(-5).reverse())
            } catch (error) {
                // Si alguna estadística falla, el dashboard igual se muestra con "-"
            } finally {
                setLoading(false)
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

                <Row className="g-3 mb-4">
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

                {!loading && (
                    <Row className="g-3">
                        <Col md={7}>
                            <div className="bg-white rounded p-3">
                                <div className="fw-semibold mb-2" style={{ fontSize: "13px" }}>Usuarios recientes</div>
                                {recentUsers.length === 0 ? (
                                    <div className="small text-muted">Sin usuarios registrados aún.</div>
                                ) : (
                                    <div className="table-scroll">
                                        <table className="table-modern" style={{ fontSize: "13px" }}>
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Correo</th>
                                                    <th>Rol</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentUsers.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{user.full_name}</td>
                                                        <td className="text-muted">{user.email}</td>
                                                        <td><span className={`role-pill role-pill-${user.role}`}>{ROLE_LABELS[user.role] || user.role}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col md={5}>
                            <div className="bg-white rounded p-3">
                                <div className="fw-semibold mb-2" style={{ fontSize: "13px" }}>Reservas recientes</div>
                                {recentReservations.length === 0 ? (
                                    <div className="small text-muted">Sin reservas registradas aún.</div>
                                ) : (
                                    <div className="table-scroll">
                                        <table className="table-modern" style={{ fontSize: "13px" }}>
                                            <thead>
                                                <tr>
                                                    <th>Miembro</th>
                                                    <th>Clase</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentReservations.map((reservation) => (
                                                    <tr key={reservation.id}>
                                                        <td>{reservation.user?.full_name || `#${reservation.id}`}</td>
                                                        <td className="text-muted">{reservation.classSchedule?.sportRoom?.sport?.name || "-"}</td>
                                                        <td>
                                                            <span className={reservation.status === "active" ? "status-pill status-pill-active" : "status-pill status-pill-inactive"}>
                                                                {reservation.status === "active" ? "Activa" : reservation.status || "-"}
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
                    </Row>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard