import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"

import { getSportRooms } from "../../services/sportRoomService"
import { DAYS_OF_WEEK } from "../../utils/dayOfWeek"
import { IconClipboard, IconCalendar, IconClock } from "../ui/Icons"

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
    const [validated, setValidated] = useState(false)

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
        setValidated(false)
    }, [selectedSchedule, show])

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
            sport_room_id: Number(formData.sport_room_id),
            day_of_week: Number(formData.day_of_week),
            start_time: formData.start_time,
            end_time: formData.end_time
        })
    }

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="modal-modern">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center gap-2">
                    <div className="modal-icon-chip" style={{ background: "#E8F0FE", color: "#1D4ED8" }}>
                        <IconClock size={19} />
                    </div>
                    <Modal.Title style={{ fontSize: "17px" }}>
                        {selectedSchedule ? "Editar Horario" : "Nuevo Horario"}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Asignación (Deporte / Sala / Coach)</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconClipboard size={16} /></span>
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
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Día de la semana</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconCalendar size={16} /></span>
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
                        </div>
                    </Form.Group>

                    <div className="row g-3">
                        <div className="col-6">
                            <Form.Label className="field-label">Hora de inicio</Form.Label>
                            <div className="field-icon-group">
                                <span className="field-icon"><IconClock size={16} /></span>
                                <Form.Control
                                    type="time"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <Form.Label className="field-label">Hora de término</Form.Label>
                            <div className="field-icon-group">
                                <span className="field-icon"><IconClock size={16} /></span>
                                <Form.Control
                                    type="time"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn-brand-ghost" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="btn-brand-primary" disabled={loadingOptions}>
                        Guardar horario
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ClassScheduleFormModal