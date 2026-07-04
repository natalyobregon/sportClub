import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"

import { getSportRooms } from "../../services/sportRoomService"
import { DAYS_OF_WEEK } from "../../utils/dayOfWeek"

const initialForm = {
    sport_room_id: "",
    day_of_week: "",
    start_time: "",
    end_time: ""
}

function ClassScheduleFormModal({ show, handleClose, handleSave, selectedSchedule }) {
    const [formData, setFormData] = useState(initialForm)
    const [assignments, setAssignments] = useState([])
    const [loadingOptions, setLoadingOptions] = useState(true)

    const loadOptions = async () => {
        try {
            setLoadingOptions(true)
            const data = await getSportRooms()
            setAssignments(data.data || data)
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoadingOptions(false)
        }
    }

    useEffect(() => {
        if (show) {
            loadOptions()
        }
    }, [show])

    useEffect(() => {
        if (selectedSchedule) {
            setFormData({
                sport_room_id: selectedSchedule.sport_room_id || selectedSchedule.sportRoom?.id || "",
                day_of_week: selectedSchedule.day_of_week || "",
                start_time: selectedSchedule.start_time ? selectedSchedule.start_time.substring(0, 5) : "",
                end_time: selectedSchedule.end_time ? selectedSchedule.end_time.substring(0, 5) : ""
            })
        } else {
            setFormData(initialForm)
        }
    }, [selectedSchedule, show])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        handleSave({
            sport_room_id: Number(formData.sport_room_id),
            day_of_week: Number(formData.day_of_week),
            start_time: formData.start_time,
            end_time: formData.end_time
        })
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {selectedSchedule ? "Editar Horario" : "Nuevo Horario"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Asignación (Deporte / Sala / Coach)</Form.Label>
                        <Form.Select
                            name="sport_room_id"
                            value={formData.sport_room_id}
                            onChange={handleChange}
                            disabled={loadingOptions}
                            required
                        >
                            <option value="">Seleccione una asignación</option>
                            {assignments.map((assignment) => (
                                <option key={assignment.id} value={assignment.id}>
                                    {assignment.sport?.name} - {assignment.room?.name} - {assignment.coach?.full_name || assignment.coach?.email}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Día de la semana</Form.Label>
                        <Form.Select
                            name="day_of_week"
                            value={formData.day_of_week}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un día</option>
                            {DAYS_OF_WEEK.map((day) => (
                                <option key={day.value} value={day.value}>
                                    {day.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hora de inicio</Form.Label>
                        <Form.Control
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hora de término</Form.Label>
                        <Form.Control
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loadingOptions}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ClassScheduleFormModal