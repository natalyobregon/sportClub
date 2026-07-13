import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { IconActivity, IconClipboard, IconClock } from "../ui/Icons"

const initialForm = {
    name: "",
    objective: "",
    duration: ""
}

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
    const [formData, setFormData] = useState(initialForm)
    const [validated, setValidated] = useState(false)

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
        setValidated(false)
    }, [selectedSport, show])

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
            duration: Number(formData.duration)
        })
    }

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="modal-modern">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center gap-2">
                    <div className="modal-icon-chip" style={{ background: "#FFF6D9", color: "#854F0B" }}>
                        <IconActivity size={19} />
                    </div>
                    <Modal.Title style={{ fontSize: "17px" }}>
                        {selectedSport ? "Editar Deporte" : "Nuevo Deporte"}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Nombre</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconActivity size={16} /></span>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Fútbol"
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
                        <Form.Label className="field-label">Objetivo</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon field-icon-top"><IconClipboard size={16} /></span>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="objective"
                                placeholder="Describe brevemente el objetivo de la disciplina"
                                value={formData.objective}
                                onChange={handleChange}
                                minLength={5}
                                maxLength={255}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                El objetivo debe tener entre 5 y 255 caracteres.
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label className="field-label">Duración estimada (minutos)</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconClock size={16} /></span>
                            <Form.Control
                                type="number"
                                name="duration"
                                placeholder="60"
                                value={formData.duration}
                                onChange={handleChange}
                                min={1}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Ingresa una duración válida.
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn-brand-ghost" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="btn-brand-primary">
                        Guardar deporte
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default SportFormModal