import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { getDayLabel } from "../../utils/dayOfWeek"
import { IconClock, IconClipboard } from "../ui/Icons"

const initialForm = {
    class_schedule_id: "",
    observation: ""
}

function ReservationModal({ show, handleClose, handleSave, sportRoomClass }) {
    const [formData, setFormData] = useState(initialForm)
    const [validated, setValidated] = useState(false)

    useEffect(() => {
        setFormData(initialForm)
        setValidated(false)
    }, [sportRoomClass, show])

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
            class_schedule_id: Number(formData.class_schedule_id),
            observation: formData.observation
        })
    }

    const schedules = sportRoomClass?.schedules || []

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="modal-modern">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center gap-2">
                    <div className="modal-icon-chip" style={{ background: "#E8EEFB", color: "#1D4ED8" }}>
                        <IconClock size={19} />
                    </div>
                    <Modal.Title style={{ fontSize: "17px" }}>
                        Reservar: {sportRoomClass?.sport?.name}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={onSubmit}>
                <Modal.Body>
                    <p className="text-muted small">
                        Sala: {sportRoomClass?.room?.name} — Coach:{" "}
                        {sportRoomClass?.coach?.full_name || sportRoomClass?.coach?.email}
                    </p>

                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Horario disponible</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconClock size={16} /></span>
                            <Form.Select
                                name="class_schedule_id"
                                value={formData.class_schedule_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un horario</option>
                                {schedules.map((schedule) => (
                                    <option key={schedule.id} value={schedule.id}>
                                        {getDayLabel(schedule.day_of_week)}{" "}
                                        {schedule.start_time?.substring(0, 5)} -{" "}
                                        {schedule.end_time?.substring(0, 5)}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label className="field-label">Observación (opcional)</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon field-icon-top"><IconClipboard size={16} /></span>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="observation"
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
                    <Button type="submit" className="btn-brand-primary" disabled={schedules.length === 0}>
                        Confirmar reserva
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ReservationModal