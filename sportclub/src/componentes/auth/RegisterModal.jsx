import { useState } from "react"
import { Alert, Button, Form, Spinner } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import { registerUser } from "../../services/authService"

// GET /api/sports requiere sesión (authenticate en todas las rutas), y el registro
// ocurre sin sesión iniciada, así que aquí se usa una lista fija en vez del catálogo real.
// Lista alineada con los deportes reales sembrados en la base (ver GET /api/sports autenticado).
const SPORT_OPTIONS = [
    "CrossFit",
    "Yoga",
    "Spinning",
    "Entrenamiento Funcional",
    "Pilates",
    "Boxeo"
]

const initialForm = {
    full_name: "",
    email: "",
    password: "",
    birth_date: "",
    sport: ""
}

function RegisterModal({ show, handleClose, onRegistered }) {
    const [formData, setFormData] = useState(initialForm)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [validated, setValidated] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const resetAndClose = () => {
        setFormData(initialForm)
        setError("")
        setValidated(false)
        handleClose()
    }

    const onSubmit = async (event) => {
        const form = event.currentTarget
        event.preventDefault()

        if (form.checkValidity() === false) {
            event.stopPropagation()
            setValidated(true)
            return
        }

        setValidated(true)
        setError("")
        setLoading(true)

        try {
            // Solo se envía birth_date si el usuario la completó (el backend la acepta como opcional)
            const payload = {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            }
            if (formData.birth_date) {
                payload.birth_date = formData.birth_date
            }
            if (formData.sport) {
                payload.metadata = { sports: [{ name: formData.sport }] }
            }

            await registerUser(payload)

            resetAndClose()
            if (onRegistered) onRegistered(formData.email)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            show={show}
            onHide={resetAndClose}
            centered
            size="lg"
            dialogClassName="modal-modern"
            contentClassName="border-0 p-0 overflow-hidden"
        >
            <div className="d-flex flex-column flex-md-row" style={{ minHeight: "460px" }}>
                {/* Panel izquierdo — mismo lenguaje visual que el Login */}
                <div
                    className="d-none d-md-flex flex-column justify-content-between"
                    style={{
                        width: "38%",
                        background: "var(--brand-purple)",
                        position: "relative",
                        padding: "28px",
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
                    <h3 className="wordmark" style={{ zIndex: 2, margin: 0, fontSize: "22px" }}>
                        SPORT<span className="wordmark-accent">CLUB</span>
                    </h3>
                    <p style={{ zIndex: 2, margin: 0, opacity: 0.9, fontSize: "13px", maxWidth: "220px" }}>
                        Únete al club y reserva tus clases favoritas.
                    </p>
                </div>

                {/* Panel derecho — formulario */}
                <div className="flex-fill position-relative" style={{ padding: "34px 32px" }}>
                    <button
                        type="button"
                        onClick={resetAndClose}
                        aria-label="Cerrar"
                        className="btn-close"
                        style={{ position: "absolute", top: "20px", right: "20px" }}
                    />

                    <h2 style={{ fontWeight: 700, color: "#222", marginBottom: "4px" }}>Crear cuenta</h2>
                    <p style={{ color: "#777", marginBottom: "22px" }}>Regístrate con tus datos para reservar clases</p>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form noValidate validated={validated} onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="field-label">Nombre completo</Form.Label>
                            <Form.Control
                                type="text"
                                name="full_name"
                                placeholder="Camila Soto"
                                value={formData.full_name}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={150}
                                required
                                style={{ height: "46px", borderRadius: "12px" }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Ingresa tu nombre completo (mínimo 3 caracteres).
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="field-label">Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="nombre@correo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ height: "46px", borderRadius: "12px" }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Ingresa un correo válido.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="field-label">Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Mínimo 8 caracteres"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                                style={{ height: "46px", borderRadius: "12px" }}
                            />
                            <Form.Control.Feedback type="invalid">
                                La contraseña debe tener al menos 8 caracteres.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="field-label">Fecha de nacimiento (opcional)</Form.Label>
                            <Form.Control
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                style={{ height: "46px", borderRadius: "12px" }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="field-label">Deporte de tu preferencia (opcional)</Form.Label>
                            <Form.Select
                                name="sport"
                                value={formData.sport}
                                onChange={handleChange}
                                style={{ height: "46px", borderRadius: "12px" }}
                            >
                                <option value="">Selecciona un deporte</option>
                                {SPORT_OPTIONS.map((sport) => (
                                    <option key={sport} value={sport}>
                                        {sport}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="small text-muted mb-3">
                            Tu cuenta se crea con rol de usuario.
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="btn-brand-yellow w-100"
                            style={{ height: "46px" }}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Creando cuenta...
                                </>
                            ) : (
                                "Crear cuenta"
                            )}
                        </Button>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}

export default RegisterModal
