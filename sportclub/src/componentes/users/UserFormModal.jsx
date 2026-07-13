import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import { IconUser, IconMail, IconLock, IconShield, IconActivity } from "../ui/Icons"
import { getSports } from "../../services/sportService"

const initialForm = {
    full_name: "",
    email: "",
    role: "user",
    password: "",
    sport: ""
}

function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
    const [formData, setFormData] = useState(initialForm)
    const [validated, setValidated] = useState(false)
    const [sports, setSports] = useState([])
    const [loadingSports, setLoadingSports] = useState(false)

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                full_name: selectedUser.full_name || "",
                email: selectedUser.email || "",
                role: selectedUser.role || "user",
                password: "",
                sport: selectedUser.metadata?.sports?.[0]?.name || ""
            })
        } else {
            setFormData(initialForm)
        }
        setValidated(false)
    }, [selectedUser, show])

    useEffect(() => {
        // El catálogo de deportes solo se necesita cuando el modal muestra la preferencia (rol usuario)
        if (show && formData.role === "user" && sports.length === 0) {
            const loadSports = async () => {
                try {
                    setLoadingSports(true)
                    const data = await getSports()
                    setSports(data.data || data)
                } catch (error) {
                    Swal.fire("Error", error.message, "error")
                } finally {
                    setLoadingSports(false)
                }
            }
            loadSports()
        }
    }, [show, formData.role, sports.length])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmit = (event) => {
        const form = event.currentTarget
        event.preventDefault()

        if (form.checkValidity() === false) {
            event.stopPropagation()
            setValidated(true)
            return
        }

        setValidated(true)

        const { sport, ...rest } = formData
        const payload = { ...rest }

        // Se preserva el resto del metadata existente (por ejemplo, la foto de perfil)
        // para no sobrescribirlo al guardar solo la preferencia de deporte.
        if (formData.role === "user" && sport) {
            payload.metadata = {
                ...(selectedUser?.metadata || {}),
                sports: [{ name: sport }]
            }
        }

        handleSave(payload)
    }

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="modal-modern">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center gap-2">
                    <div className="modal-icon-chip" style={{ background: "#EEEDFE", color: "var(--brand-purple)" }}>
                        <IconUser size={19} />
                    </div>
                    <Modal.Title style={{ fontSize: "17px" }}>
                        {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Nombre completo</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconUser size={16} /></span>
                            <Form.Control
                                type="text"
                                name="full_name"
                                placeholder="Maria Gonzalez"
                                value={formData.full_name}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={150}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                El nombre debe tener al menos 3 caracteres.
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Correo</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconMail size={16} /></span>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="nombre@club.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Ingresa un correo válido.
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Contraseña</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconLock size={16} /></span>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder={selectedUser ? "Nueva contraseña" : "Mínimo 8 caracteres"}
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                La contraseña debe tener al menos 8 caracteres.
                            </Form.Control.Feedback>
                        </div>
                        {selectedUser && (
                            <Form.Text className="text-muted">
                                Debes ingresarla nuevamente aunque no la cambies.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className={formData.role === "user" ? "mb-3" : "mb-1"}>
                        <Form.Label className="field-label">Rol</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconShield size={16} /></span>
                            <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                                <option value="user">Usuario</option>
                                <option value="coach">Coach</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </div>
                    </Form.Group>

                    {formData.role === "user" && (
                        <Form.Group className="mb-1">
                            <Form.Label className="field-label">Deporte de preferencia (opcional)</Form.Label>
                            <div className="field-icon-group">
                                <span className="field-icon"><IconActivity size={16} /></span>
                                <Form.Select
                                    name="sport"
                                    value={formData.sport}
                                    onChange={handleChange}
                                    disabled={loadingSports}
                                >
                                    <option value="">Sin preferencia</option>
                                    {sports.map((sport) => (
                                        <option key={sport.id} value={sport.name}>
                                            {sport.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                        </Form.Group>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn-brand-ghost" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="btn-brand-primary">
                        Guardar usuario
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default UserFormModal



