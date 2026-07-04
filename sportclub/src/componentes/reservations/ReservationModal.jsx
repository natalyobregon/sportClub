import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { getDayLabel } from "../../utils/dayOfWeek"

const initialForm = {
    class_schedule_id: "",
    observation: ""
}

function ReservationModal({ show, handleClose, handleSave, sportRoomClass }) {
    const [formData, setFormData] = useState(initialForm)

    useEffect(() => {
        setFormData(initialForm)
    }, [sportRoomClass, show])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        handleSave({
            class_schedule_id: Number(formData.class_schedule_id),
            observation: formData.observation
        })
    }

    const schedules = sportRoomClass?.schedules || []

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Reservar: {sportRoomClass?.sport?.name}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <p className="text-muted">
                        Sala: {sportRoomClass?.room?.name} — Coach:{" "}
                        {sportRoomClass?.coach?.full_name || sportRoomClass?.coach?.email}
                    </p>

                    <Form.Group className="mb-3">
                        <Form.Label>Horario disponible</Form.Label>
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
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Observación (opcional)</Form.Label>
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
                    <Button variant="primary" type="submit" disabled={schedules.length === 0}>
                        Confirmar Reserva
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ReservationModal