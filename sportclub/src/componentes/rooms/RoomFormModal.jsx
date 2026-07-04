import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const initialForm = {
    name: "",
    description: "",
    capacity: "",
    location: "",
    observation: ""
}

function RoomFormModal({ show, handleClose, handleSave, selectedRoom }) {
    const [formData, setFormData] = useState(initialForm)

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
    }, [selectedRoom, show])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        handleSave({
            ...formData,
            capacity: Number(formData.capacity)
        })
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{selectedRoom ? "Editar Sala" : "Nueva Sala"}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            minLength={3}
                            maxLength={100}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            minLength={5}
                            maxLength={255}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Capacidad</Form.Label>
                        <Form.Control
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            min={1}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ubicación</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            maxLength={150}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Observación</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="observation"
                            value={formData.observation}
                            onChange={handleChange}
                            maxLength={255}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default RoomFormModal