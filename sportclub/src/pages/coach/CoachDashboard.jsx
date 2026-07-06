import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { getMyClasses, getMySchedules } from "../../services/coachService"
import { getDayLabel } from "../../utils/dayOfWeek"

function CoachDashboard() {
    const [classesCount, setClassesCount] = useState("-")
    const [nextSchedule, setNextSchedule] = useState(null)

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [classesRes, schedulesRes] = await Promise.all([
                    getMyClasses(),
                    getMySchedules(),
                ])
                const classes = classesRes.data || classesRes
                const schedules = schedulesRes.data || schedulesRes

                setClassesCount(classes.length)
                setNextSchedule(schedules[0] || null)
            } catch (error) {
                // Si alguna estadística falla, el dashboard igual se muestra con "-"
            }
        }
        loadStats()
    }, [])

    return (
        <div className="split-bg" style={{ borderRadius: "12px" }}>
            <div className="split-bg-a" style={{ background: "var(--role-coach-a)" }}></div>
            <div className="split-bg-b" style={{ background: "var(--role-coach-b)" }}></div>

            <div className="split-content" style={{ padding: "32px 28px" }}>
                <div className="small text-white mb-2" style={{ opacity: 0.75, letterSpacing: "1px" }}>PANEL</div>

                <h1 className="brand-heading text-white" style={{ fontSize: "32px" }}>
                    Coach
                </h1>
                <p className="text-white mb-4" style={{ opacity: 0.9, maxWidth: "460px" }}>
                    Mis clases asignadas y mi horario semanal.
                </p>

                <Row className="g-3">
                    <Col xs={12} md={5}>
                        <div className="bg-white rounded p-3 h-100">
                            <div className="fw-bold fs-3" style={{ color: "var(--role-coach-a)" }}>{classesCount}</div>
                            <div className="small text-muted">clases asignadas</div>
                        </div>
                    </Col>
                    <Col xs={12} md={7}>
                        <div className="rounded p-3 h-100" style={{ backgroundColor: "var(--brand-ink)" }}>
                            {nextSchedule ? (
                                <>
                                    <div className="small fw-bold text-white">
                                        Próximo horario
                                    </div>
                                    <div className="fw-bold text-white">
                                        {getDayLabel(nextSchedule.day_of_week)}{" "}
                                        {nextSchedule.start_time?.substring(0, 5)} - {nextSchedule.end_time?.substring(0, 5)}
                                    </div>
                                    <div className="small text-white" style={{ opacity: 0.8 }}>
                                        {nextSchedule.sportRoom?.sport?.name} · {nextSchedule.sportRoom?.room?.name}
                                    </div>
                                </>
                            ) : (
                                <div className="small text-white">
                                    Aún no tienes horarios asignados.
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default CoachDashboard