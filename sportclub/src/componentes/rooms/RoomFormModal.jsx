import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { IconDoor, IconClipboard, IconUsers, IconLayout } from "../ui/Icons"

const initialForm = {
    name: "",
    description: "",
    capacity: "",
    location: "",
    observation: ""
}

function RoomFormModal({ show, handleClose, handleSave, selectedRoom }) {
    const [formData, setFormData] = useState(initialForm)
    const [validated, setValidated] = useState(false)

    useEffect(() => {
        if (selectedRoom) {
            setFormData({
                name: selectedRoom.name || "",
                description: selectedRoom.description || "",
                capacity: selectedRoom.capacity || "",
                location: selectedRoom.location || "",
                observation: selectedRoom.observation || ""
            })
        } else {
            setFormData(initialForm)
        }
        setValidated(false)
    }, [selectedRoom, show])

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
        handleSave({
            ...formData,
            capacity: Number(formData.capacity)
        })
    }

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="modal-modern">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center gap-2">
                    <div className="modal-icon-chip" style={{ background: "#E6F1FB", color: "#0C447C" }}>
                        <IconDoor size={19} />
                    </div>
                    <Modal.Title style={{ fontSize: "17px" }}>
                        {selectedRoom ? "Editar Sala" : "Nueva Sala"}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Nombre</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconDoor size={16} /></span>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Sala A"
                                value={formData.name}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={100}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                El nombre debe tener entre 3 y 100 caracteres.
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Descripción</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon field-icon-top"><IconClipboard size={16} /></span>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="description"
                                placeholder="Describe brevemente la sala"
                                value={formData.description}
                                onChange={handleChange}
                                minLength={5}
                                maxLength={255}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                La descripción debe tener entre 5 y 255 caracteres.
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <Form.Label className="field-label">Capacidad</Form.Label>
                            <div className="field-icon-group">
                                <span className="field-icon"><IconUsers size={16} /></span>
                                <Form.Control
                                    type="number"
                                    name="capacity"
                                    placeholder="20"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    min={1}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Ingresa una capacidad válida.
                                </Form.Control.Feedback>
                            </div>
                        </div>
                        <div className="col-6">
                            <Form.Label className="field-label">Ubicación</Form.Label>
                            <div className="field-icon-group">
                                <span className="field-icon"><IconLayout size={16} /></span>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    placeholder="Piso 2"
                                    value={formData.location}
                                    onChange={handleChange}
                                    maxLength={150}
                                />
                            </div>
                        </div>
                    </div>

                    <Form.Group className="mb-1">
                        <Form.Label className="field-label">Observación</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon field-icon-top"><IconClipboard size={16} /></span>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="observation"
                                placeholder="Opcional"
                                value={formData.observation}
                                onChange={handleChange}
                                maxLength={255}
                            />
                        </div>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn-brand-ghost" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="btn-brand-primary">
                        Guardar sala
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default RoomFormModal
