import { useEffect, useState } from "react"
import { Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import RoomFormModal from "../../componentes/rooms/RoomFormModal"

import {
    createRoom,
    deleteRoom,
    getRooms,
    updateRoom,
} from "../../services/roomService"

function RoomsPage() {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState(null)

    const loadRooms = async () => {
        try {
            setLoading(true)
            const data = await getRooms()
            setRooms(data.data || data)
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRooms()
    }, [])

    const openCreateModal = () => {
        setSelectedRoom(null)
        setShowModal(true)
    }

    const openEditModal = (room) => {
        setSelectedRoom(room)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedRoom(null)
    }

    const handleSave = async (formData) => {
        try {
            if (selectedRoom) {
                await updateRoom(selectedRoom.id, formData)
                Swal.fire("Actualizada", "Sala actualizada correctamente", "success")
            } else {
                await createRoom(formData)
                Swal.fire("Creada", "Sala creada correctamente", "success")
            }
            closeModal()
            loadRooms()
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        }
    }

    const handleDelete = async (room) => {
        const result = await Swal.fire({
            title: "¿Eliminar sala?",
            text: `Se eliminará "${room.name}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
        })

        if (result.isConfirmed) {
            try {
                await deleteRoom(room.id)
                Swal.fire("Eliminada", "Sala eliminada correctamente", "success")
                loadRooms()
            } catch (error) {
                Swal.fire("Error", error.message, "error")
            }
        }
    }

    return (
        <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Gestión de Salas</h4>
                <Button variant="primary" onClick={openCreateModal}>
                    Nueva Sala
                </Button>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando salas...</p>
                    </div>
                ) : (
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Capacidad</th>
                                <th>Ubicación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room.id}>
                                    <td>{room.id}</td>
                                    <td>{room.name}</td>
                                    <td>{room.description}</td>
                                    <td>{room.capacity}</td>
                                    <td>{room.location || "-"}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => openEditModal(room)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(room)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>

            <RoomFormModal
                show={showModal}
                handleClose={closeModal}
                handleSave={handleSave}
                selectedRoom={selectedRoom}
            />
        </Card>
    )
}

export default RoomsPage