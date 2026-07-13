import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"

import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"
import { getUsers } from "../../services/userService"
import { IconActivity, IconDoor, IconWhistle, IconClipboard } from "../ui/Icons"

const initialForm = {
    sport_id: "",
    room_id: "",
    coach_id: "",
    observation: ""
}

function SportRoomFormModal({ show, handleClose, handleSave, selectedSportRoom }) {
    const [formData, setFormData] = useState(initialForm)
    const [sports, setSports] = useState([])
    const [rooms, setRooms] = useState([])
    const [coaches, setCoaches] = useState([])
    const [loadingOptions, setLoadingOptions] = useState(true)
    const [validated, setValidated] = useState(false)

    const loadOptions = async () => {
        try {
            setLoadingOptions(true)
            const [sportsData, roomsData, coachesData] = await Promise.all([
                getSports(),
                getRooms(),
                getUsers({ role: "coach" })
            ])

            setSports(sportsData.data || sportsData)
            setRooms(roomsData.data || roomsData)
            setCoaches(coachesData.data || coachesData)
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
        if (selectedSportRoom) {
            setFormData({
                sport_id: selectedSportRoom.sport_id || selectedSportRoom.sport?.id || "",
                room_id: selectedSportRoom.room_id || selectedSportRoom.room?.id || "",
                coach_id: selectedSportRoom.coach_id || selectedSportRoom.coach?.id || "",
                observation: selectedSportRoom.observation || ""
            })
        } else {
            setFormData(initialForm)
        }
        setValidated(false)
    }, [selectedSportRoom, show])

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
            sport_id: Number(formData.sport_id),
            room_id: Number(formData.room_id),
            coach_id: Number(formData.coach_id),
            observation: formData.observation
        })
    }

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="modal-modern">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center gap-2">
                    <div className="modal-icon-chip" style={{ background: "#FAECE7", color: "#712B13" }}>
                        <IconClipboard size={19} />
                    </div>
                    <Modal.Title style={{ fontSize: "17px" }}>
                        {selectedSportRoom ? "Editar Asignación" : "Nueva Asignación"}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Deporte</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconActivity size={16} /></span>
                            <Form.Select
                                name="sport_id"
                                value={formData.sport_id}
                                onChange={handleChange}
                                disabled={loadingOptions}
                                required
                            >
                                <option value="">Seleccione un deporte</option>
                                {sports.map((sport) => (
                                    <option key={sport.id} value={sport.id}>
                                        {sport.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Sala</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconDoor size={16} /></span>
                            <Form.Select
                                name="room_id"
                                value={formData.room_id}
                                onChange={handleChange}
                                disabled={loadingOptions}
                                required
                            >
                                <option value="">Seleccione una sala</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="field-label">Coach</Form.Label>
                        <div className="field-icon-group">
                            <span className="field-icon"><IconWhistle size={16} /></span>
                            <Form.Select
                                name="coach_id"
                                value={formData.coach_id}
                                onChange={handleChange}
                                disabled={loadingOptions}
                                required
                            >
                                <option value="">Seleccione un coach</option>
                                {coaches.map((coach) => (
                                    <option key={coach.id} value={coach.id}>
                                        {coach.full_name || coach.email}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </Form.Group>

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
                    <Button type="submit" className="btn-brand-primary" disabled={loadingOptions}>
                        Guardar asignación
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default SportRoomFormModal
