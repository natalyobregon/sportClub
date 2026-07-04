import { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const initialForm = {
    current_password: "",
    new_password: "",
    confirm_password: ""
}

function PasswordModal({ show, handleClose, handleSave }) {
    const [formData, setFormData] = useState(initialForm)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        await handleSave(formData)
        setFormData(initialForm)
    }

    const onHide = () => {
        setFormData(initialForm)
        handleClose()
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cambiar Contraseña</Modal.Title>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña actual</Form.Label>
                        <Form.Control
                            type="password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nueva contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar nueva contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Actualizar Contraseña
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default PasswordModal