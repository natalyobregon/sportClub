import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const initialForm = {
    name: "",
    objective: "",
    duration: ""
}

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
    const [formData, setFormData] = useState(initialForm)

    useEffect(() => {
        if (selectedSport) {
            setFormData({
                name: selectedSport.name || "",
                objective: selectedSport.objective || "",
                duration: selectedSport.duration || ""
            })
        } else {
            setFormData(initialForm)
        }
    }, [selectedSport, show])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        handleSave({
            ...formData,
            duration: Number(formData.duration)
        })
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{selectedSport ? "Editar Deporte" : "Nuevo Deporte"}</Modal.Title>
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
                        <Form.Label>Objetivo</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="objective"
                            value={formData.objective}
                            onChange={handleChange}
                            minLength={5}
                            maxLength={255}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Duración estimada (minutos)</Form.Label>
                        <Form.Control
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            min={1}
                            required
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

export default SportFormModal