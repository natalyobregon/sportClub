import { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { IconLock } from "../ui/Icons"

const initialForm = {
    current_password: "",
    new_password: "",
    confirm_password: ""
}

function PasswordModal({ show, handleClose, handleSave }) {
    const [formData, setFormData] = useState(initialForm)
    const [validated, setValidated] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
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
        await handleSave(formData)
        setFormData(initialForm)
        setValidated(false)
    }

    const onHide = () => {
        setFormData(initialForm)
        setValidated(false)
        handleClose()
    }

    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="modal-modern">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center gap-2">
                    <div className="modal-icon-chip" style={{ background: "#EEEDFE", color: "var(--brand-purple)" }}>
                        <IconLock size={19} />
                    </div>
                    <Modal.Title style={{ fontSize: "17px" }}>Cambiar Contraseña</Modal.Title>
                </div>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3 field-icon-group">
                        <Form.Label className="field-label">Contraseña actual</Form.Label>
                        <span className="field-icon"><IconLock size={16} /></span>
                        <Form.Control
                            type="password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Ingresa tu contraseña actual.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3 field-icon-group">
                        <Form.Label className="field-label">Nueva contraseña</Form.Label>
                        <span className="field-icon"><IconLock size={16} /></span>
                        <Form.Control
                            type="password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Debe tener al menos 8 caracteres.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1 field-icon-group">
                        <Form.Label className="field-label">Confirmar nueva contraseña</Form.Label>
                        <span className="field-icon"><IconLock size={16} /></span>
                        <Form.Control
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Debe tener al menos 8 caracteres.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn-brand-ghost" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="btn-brand-primary">
                        Actualizar contraseña
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default PasswordModal