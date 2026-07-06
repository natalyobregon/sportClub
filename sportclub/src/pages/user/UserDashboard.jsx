import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { getMyReservations } from "../../services/reservationService"
import { getAvailableClasses } from "../../services/memberService"

function UserDashboard() {
    const [activeCount, setActiveCount] = useState("-")
    const [classesCount, setClassesCount] = useState("-")

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [reservationsRes, classesRes] = await Promise.all([
                    getMyReservations(),
                    getAvailableClasses(),
                ])
                const reservations = reservationsRes.data || reservationsRes
                const classes = classesRes.data || classesRes

                setActiveCount(reservations.filter((r) => r.status === "active").length)
                setClassesCount(classes.length)
            } catch (error) {
                // Si alguna estadística falla, el dashboard igual se muestra con "-"
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

                <Row className="g-3">
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
            </div>
        </div>
    )
}

export default UserDashboard