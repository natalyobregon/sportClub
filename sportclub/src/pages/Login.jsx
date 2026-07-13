import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Form, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { loginUser, saveSession } from "../services/authService"
import RegisterModal from "../componentes/auth/RegisterModal"
import gym from "../assets/gym.jpg"

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

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

    const handleRegistered = (registeredEmail) => {
        Swal.fire({
            title: "¡Cuenta creada!",
            text: "Ya puedes iniciar sesión con tus credenciales.",
            icon: "success",
            timer: 2200,
            showConfirmButton: false
        })
        if (registeredEmail) {
            setEmail(registeredEmail)
        }
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                padding: "30px",
                backgroundImage: `
                    linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)),
                    url(${gym})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <div
                className="shadow"
                style={{
                    width: "900px",
                    maxWidth: "100%",
                    display: "flex",
                    background: "#fff",
                    borderRadius: "24px",
                    overflow: "hidden"
                }}
            >
                {/* Panel izquierdo */}
                <div
                    style={{
                        width: "40%",
                        background: "var(--brand-purple)",
                        position: "relative",
                        padding: "30px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        color: "#fff",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "55%",
                            background: "var(--brand-yellow)",
                            clipPath: "polygon(0 35%,100% 0,100% 100%,0 100%)"
                        }}
                    />

                    <h2
                        className="wordmark"
                        style={{
                            zIndex: 2,
                            margin: 0,
                            fontSize: "30px"
                        }}
                    >
                        SPORT<span className="wordmark-accent">CLUB</span>
                    </h2>

                </div>

                {/* Panel derecho */}
                <div
                    style={{
                        width: "60%",
                        padding: "50px"
                    }}
                >
                    <h2
                        style={{
                            fontWeight: "700",
                            color: "#222",
                            marginBottom: "6px"
                        }}
                    >
                        ¡Hola de nuevo!
                    </h2>

                    <p
                        style={{
                            color: "#777",
                            marginBottom: "30px"
                        }}
                    >
                        Entra con tu correo del club
                    </p>

                    {error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>

                            <Form.Control
                                type="email"
                                placeholder="nombre@club.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    height: "48px",
                                    borderRadius: "12px"
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Contraseña</Form.Label>

                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    height: "48px",
                                    borderRadius: "12px"
                                }}
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                height: "48px",
                                border: "none",
                                borderRadius: "12px",
                                background: "var(--brand-yellow)",
                                color: "#222",
                                fontWeight: "700",
                                fontSize: "16px"
                            }}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        className="me-2"
                                    />
                                    Ingresando...
                                </>
                            ) : (
                                "Ingresar"
                            )}
                        </Button>

                        <div className="text-center mt-4" style={{ fontSize: "14px", color: "#777" }}>
                            ¿Aún no tienes cuenta?{" "}
                            <button
                                type="button"
                                onClick={() => setShowRegister(true)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: "var(--brand-purple)",
                                    fontWeight: "700",
                                    textDecoration: "underline",
                                    cursor: "pointer"
                                }}
                            >
                                Crear cuenta
                            </button>
                        </div>

                    </Form>
                </div>
            </div>

            <RegisterModal
                show={showRegister}
                handleClose={() => setShowRegister(false)}
                onRegistered={handleRegistered}
            />
        </div>
    )
}

export default Login
