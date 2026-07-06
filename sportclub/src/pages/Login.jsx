import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { loginUser, saveSession } from "../services/authService"
import logo from "../assets/logo.png"

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")
        setLoading(true)
        try {
            const user = await loginUser({ email, password })

            saveSession(user.data.token, user.data.user)

            await Swal.fire({
                title: "¡Sesión iniciada con éxito!",
                text: `Bienvenido, ${user.data.user.full_name}`,
                icon: "success",
                timer: 1800,
                showConfirmButton: false
            })

            if (user.data.user.role === "admin") {
                navigate("/admin/dashboard")
            } else if (user.data.user.role === "coach") {
                navigate("/coach/dashboard")
            } else {
                navigate("/user/dashboard")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
            <Row className="g-0" style={{ minHeight: "100vh" }}>
                <Col md={5} className="split-bg d-none d-md-flex flex-column justify-content-between p-4">
                    <div className="split-bg-a" style={{ background: "var(--brand-purple)" }}></div>
                    <div className="split-bg-b" style={{ background: "var(--brand-yellow)" }}></div>

                    <div className="split-content d-flex align-items-center gap-3">
                        <img src={logo} alt="SportClub" className="brand-crest" />
                        <span className="brand-heading text-white" style={{ fontSize: "16px" }}>
                            SportClub
                        </span>
                    </div>

                    <div className="split-content text-white">
                        <p className="brand-heading mb-0" style={{ fontSize: "22px" }}>
                            Entrena hoy, agradece mañana
                        </p>
                    </div>
                </Col>

                <Col md={7} className="d-flex align-items-center justify-content-center bg-white">
                    <div style={{ width: "22rem" }}>
                        <h2 className="brand-heading mb-1" style={{ fontSize: "22px", color: "var(--brand-ink)" }}>
                            Hola de nuevo
                        </h2>
                        <p className="text-muted mb-4">Entra con tu correo del club</p>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingrese su correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 border-0"
                                style={{ backgroundColor: "var(--brand-purple)" }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" animation="border" /> Ingresando...
                                    </>
                                ) : (
                                    "Ingresar"
                                )}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login
