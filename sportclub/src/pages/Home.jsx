import { Link } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import gymPhoto from "../assets/gym2.jpg"

const STATS = [
    ["2500+", "Socios activos"],
    ["18", "Deportes"],
    ["35", "Entrenadores"],
    ["100%", "Reservas online"]
]

function Home() {
    return (
        <div
            style={{
                background: "#f6f7fb",
                minHeight: "100vh",
                overflow: "hidden"
            }}
        >
            {/* HERO */}
            <section
                style={{
                    position: "relative",
                    minHeight: "78vh",
                    backgroundImage: `linear-gradient(rgba(20, 18, 26, 0.55), rgba(91, 33, 182, 0.75)), url(${gymPhoto})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    paddingBottom: "0"
                }}
            >
                <Container>
                    <div style={{ maxWidth: "560px" }}>
                        <span
                            className="wordmark text-white d-inline-block mb-3"
                            style={{ fontSize: "60px" }}
                        >
                            SPORT
                            <span className="wordmark-accent">CLUB</span>
                        </span>

                        <h1
                            className="text-white"
                            style={{
                                fontSize: "48px",
                                fontWeight: 800,
                                lineHeight: 1.15
                            }}
                        >
                            Entrena cuando quieras.
                            <br />
                            Reserva en segundos.
                        </h1>

                        <p
                            className="text-white mb-4"
                            style={{
                                opacity: 0.85,
                                fontSize: "16px",
                                maxWidth: "460px"
                            }}
                        >
                            Organiza tus entrenamientos, reserva clases y lleva el
                            control de tus actividades desde un solo lugar.
                        </p>

                        <div className="d-flex gap-2 flex-wrap">
                            <Link
                                to="/login"
                                className="btn-brand-yellow"
                                style={{
                                    padding: "13px 30px",
                                    textDecoration: "none"
                                }}
                            >
                                Comenzar ahora
                            </Link>

                            <Link
                                to="/login"
                                style={{
                                    padding: "13px 30px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255,255,255,0.5)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    textDecoration: "none"
                                }}
                            >
                                Iniciar sesión
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ESTADÍSTICAS */}
            <Container>
                <Row
                    className="justify-content-center g-3"
                    style={{
                        marginTop: "-6px",
                        position: "relative",
                        zIndex: 2,
                        paddingBottom: "0"
                    }}
                >
                    {STATS.map(([value, label]) => (
                        <Col key={label} lg={3} md={6} xs={6}>
                            <div className="card-modern text-center py-4">
                                <div
                                    style={{
                                        fontWeight: 800,
                                        fontSize: "50px",
                                        color: "var(--brand-purple)"
                                    }}
                                >
                                    {value}
                                </div>

                                <div className="small text-muted">
                                    {label}
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default Home
