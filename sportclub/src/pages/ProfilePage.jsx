import { useEffect, useRef, useState } from "react"
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import PasswordModal from "../componentes/profile/PasswordModal"
import { getProfile, updateProfile, changeMyPassword } from "../services/profileService"
import { saveSession, getToken } from "../services/authService"
import { IconUser, IconMail, IconCalendar, IconCamera, IconLock } from "../componentes/ui/Icons"

const initialForm = {
    full_name: "",
    email: "",
    birth_date: ""
}

const ROLE_LABELS = { admin: "Administrador", coach: "Coach", user: "Usuario" }

function getInitials(name) {
    if (!name) return "?"
    const parts = name.trim().split(" ").filter(Boolean)
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase()
}

// La API no tiene una columna dedicada para foto de perfil, pero el campo
// "metadata" (JSON) sí es libre y ya lo acepta PUT /me sin cambios en el backend.
// Por eso la foto se guarda como imagen en base64 dentro de metadata.avatar.
const MAX_AVATAR_SIZE = 1.5 * 1024 * 1024 // ~1.5MB antes de convertir a base64

function ProfilePage() {
    const [formData, setFormData] = useState(initialForm)
    const [metadata, setMetadata] = useState({})
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const fileInputRef = useRef(null)

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
            setMetadata(profile.metadata || {})
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

    const persistProfile = async (nextMetadata) => {
        const response = await updateProfile({ ...formData, metadata: nextMetadata })
        const updatedUser = response.data || response

        // Mantiene sincronizado el usuario guardado en sesión (usado por el navbar y RoleRoute)
        saveSession(getToken(), updatedUser)
        setMetadata(updatedUser.metadata || nextMetadata)
        return updatedUser
    }

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            Swal.fire("Formato inválido", "Selecciona un archivo de imagen.", "error")
            return
        }

        if (file.size > MAX_AVATAR_SIZE) {
            Swal.fire("Imagen muy pesada", "Elige una imagen de hasta 1.5MB.", "error")
            return
        }

        const reader = new FileReader()
        reader.onload = async () => {
            try {
                setUploadingAvatar(true)
                // Se preservan las demás claves de metadata (por ejemplo, sports) para no perderlas
                await persistProfile({ ...metadata, avatar: reader.result })
                Swal.fire("Actualizado", "Foto de perfil actualizada", "success")
            } catch (error) {
                Swal.fire("Error", error.message, "error")
            } finally {
                setUploadingAvatar(false)
            }
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            setSaving(true)
            await persistProfile(metadata)
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
                <Card className="card-modern">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0" style={{ fontWeight: 700 }}>Mi Perfil</h4>
                        {role && <span className={`role-pill role-pill-${role}`}>{ROLE_LABELS[role] || role}</span>}
                    </Card.Header>

                    <Card.Body className="p-4">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="avatar-upload-wrap">
                                {metadata.avatar ? (
                                    <img src={metadata.avatar} alt="Foto de perfil" />
                                ) : (
                                    <div
                                        className="avatar-upload-circle"
                                        style={{ background: "#EEEDFE", color: "var(--brand-purple)" }}
                                    >
                                        {getInitials(formData.full_name)}
                                    </div>
                                )}
                                <label className="avatar-upload-camera" title="Cambiar foto">
                                    {uploadingAvatar ? (
                                        <Spinner animation="border" size="sm" style={{ width: "12px", height: "12px" }} />
                                    ) : (
                                        <IconCamera size={13} />
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        disabled={uploadingAvatar}
                                    />
                                </label>
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{formData.full_name}</div>
                                <div className="small text-muted">{formData.email}</div>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="field-label">Nombre Completo</Form.Label>
                                <div className="field-icon-group">
                                    <span className="field-icon"><IconUser size={16} /></span>
                                    <Form.Control
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="field-label">Correo</Form.Label>
                                <div className="field-icon-group">
                                    <span className="field-icon"><IconMail size={16} /></span>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="field-label">Fecha de Nacimiento</Form.Label>
                                <div className="field-icon-group">
                                    <span className="field-icon"><IconCalendar size={16} /></span>
                                    <Form.Control
                                        type="date"
                                        name="birth_date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Form.Group>

                            <div className="d-flex justify-content-between">
                                <Button
                                    type="button"
                                    className="btn-brand-ghost d-flex align-items-center gap-2"
                                    onClick={() => setShowPasswordModal(true)}
                                >
                                    <IconLock size={15} /> Cambiar Contraseña
                                </Button>

                                <Button type="submit" className="btn-brand-primary" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Spinner size="sm" animation="border" className="me-2" /> Guardando...
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
