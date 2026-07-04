import { useEffect, useState } from "react"
import { Badge, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import PasswordModal from "../componentes/profile/PasswordModal"
import { getProfile, updateProfile, changeMyPassword } from "../services/profileService"
import { saveSession, getToken } from "../services/authService"

const initialForm = {
    full_name: "",
    email: "",
    birth_date: ""
}

function ProfilePage() {
    const [formData, setFormData] = useState(initialForm)
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    const loadProfile = async () => {
        try {
            setLoading(true)
            const response = await getProfile()
            const profile = response.data || response

            setFormData({
                full_name: profile.full_name || "",
                email: profile.email || "",
                birth_date: profile.birth_date ? profile.birth_date.substring(0, 10) : ""
            })
            setRole(profile.role || "")
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            setSaving(true)
            const response = await updateProfile(formData)
            const updatedUser = response.data || response

            // Mantiene sincronizado el usuario guardado en sesión (usado por el navbar y RoleRoute)
            saveSession(getToken(), updatedUser)

            Swal.fire("Actualizado", "Perfil actualizado correctamente", "success")
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async (passwordData) => {
        try {
            await changeMyPassword(passwordData)
            setShowPasswordModal(false)
            Swal.fire("Actualizado", "Contraseña actualizada correctamente", "success")
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        }
    }

    if (loading) {
        return (
            <div className="text-center p-4">
                <Spinner animation="border" />
                <p className="mt-2">Cargando perfil...</p>
            </div>
        )
    }

    return (
        <Row className="justify-content-center">
            <Col md={7}>
                <Card className="shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Mi Perfil</h4>
                        {role && <Badge bg="info">{role}</Badge>}
                    </Card.Header>

                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Nacimiento</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between">
                                <Button
                                    variant="outline-secondary"
                                    type="button"
                                    onClick={() => setShowPasswordModal(true)}
                                >
                                    Cambiar Contraseña
                                </Button>

                                <Button variant="primary" type="submit" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Spinner size="sm" animation="border" /> Guardando...
                                        </>
                                    ) : (
                                        "Guardar Cambios"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>

            <PasswordModal
                show={showPasswordModal}
                handleClose={() => setShowPasswordModal(false)}
                handleSave={handleChangePassword}
            />
        </Row>
    )
}

export default ProfilePage