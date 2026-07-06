import { Link } from "react-router-dom"
import { Col, Row } from "react-bootstrap"
import logo from "../assets/logo.png"

function Home() {
    return (
        <div style={{ borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
            <div className="split-bg" style={{ minHeight: "50vh" }}>
                <div className="split-bg-a" style={{ background: "var(--brand-purple)" }}></div>
                <div
                    className="split-bg-b"
                    style={{ background: "var(--brand-yellow)", clipPath: "polygon(0 88%, 100% 78%, 100% 100%, 0 100%)" }}
                ></div>

                <div className="split-content" style={{ padding: "36px 28px 40px" }}>
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <img src={logo} alt="SportClub" className="brand-crest" style={{ width: "64px", height: "64px" }} />
                        <span className="brand-heading text-white" style={{ fontSize: "15px", letterSpacing: "1px" }}>
                            SportClub
                        </span>
                    </div>

                    <h1 className="brand-heading text-white" style={{ fontSize: "36px", lineHeight: 1.2, maxWidth: "480px" }}>
                        Bienvenido a SportClub
                    </h1>
                    <p className="text-white mb-4" style={{ maxWidth: "420px", opacity: 0.9 }}>
                        Reserva tus clases y controla tu horario, sin complicaciones.
                    </p>

                    <Link to="/login">
                        <span
                            className="d-inline-block fw-bold"
                            style={{
                                backgroundColor: "var(--brand-yellow)",
                                color: "var(--brand-ink)",
                                padding: "12px 28px",
                                borderRadius: "6px",
                                fontSize: "15px",
                            }}
                        >
                            Iniciar sesión
                        </span>
                    </Link>
                </div>
            </div>

            <div className="bg-white p-4">
                <Row className="g-3">
                    <Col xs={4}>
                        <div className="rounded p-3 text-center" style={{ backgroundColor: "var(--bs-light)" }}>
                            <div className="fw-bold fs-3" style={{ color: "var(--brand-purple)" }}>12</div>
                            <div className="small text-muted">deportes</div>
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="rounded p-3 text-center" style={{ backgroundColor: "var(--bs-light)" }}>
                            <div className="fw-bold fs-3" style={{ color: "var(--brand-purple)" }}>6</div>
                            <div className="small text-muted">salas</div>
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="rounded p-3 text-center" style={{ backgroundColor: "var(--bs-light)" }}>
                            <div className="fw-bold fs-3" style={{ color: "var(--brand-purple)" }}>24</div>
                            <div className="small text-muted">horarios/sem</div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Home