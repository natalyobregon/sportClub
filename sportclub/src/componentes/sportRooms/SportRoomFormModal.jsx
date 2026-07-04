import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"

import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"
import { getUsers } from "../../services/userService"

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
    }, [selectedSportRoom, show])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        handleSave({
            sport_id: Number(formData.sport_id),
            room_id: Number(formData.room_id),
            coach_id: Number(formData.coach_id),
            observation: formData.observation
        })
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {selectedSportRoom ? "Editar Asignación" : "Nueva Asignación"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Deporte</Form.Label>
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
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sala</Form.Label>
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
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Coach</Form.Label>
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
                    <Button variant="primary" type="submit" disabled={loadingOptions}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default SportRoomFormModal