import { useEffect, useState } from "react"
import { Button, Card, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import RoomFormModal from "../../componentes/rooms/RoomFormModal"
import { IconPlus, IconEdit, IconTrash, IconDoor } from "../../componentes/ui/Icons"

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
        <Card className="card-modern">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0" style={{ fontWeight: 700 }}>Gestión de Salas</h4>
                    <div className="small text-muted">{rooms.length} salas registradas</div>
                </div>
                <Button className="btn-brand-primary d-flex align-items-center gap-2" onClick={openCreateModal}>
                    <IconPlus size={16} /> Nueva Sala
                </Button>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando salas...</p>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        <IconDoor size={28} />
                        <p className="mt-2 mb-0">Aún no hay salas registradas.</p>
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Capacidad</th>
                                    <th>Ubicación</th>
                                    <th style={{ textAlign: "right" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="avatar-badge"
                                                    style={{ background: "#E6F1FB", color: "#0C447C" }}
                                                >
                                                    <IconDoor size={14} />
                                                </div>
                                                <span>{room.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted" style={{ maxWidth: "280px" }}>{room.description}</td>
                                        <td>{room.capacity}</td>
                                        <td className="text-muted">{room.location || "-"}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                type="button"
                                                className="icon-action-btn me-2"
                                                onClick={() => openEditModal(room)}
                                                aria-label="Editar sala"
                                                title="Editar"
                                            >
                                                <IconEdit size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                className="icon-action-btn danger"
                                                onClick={() => handleDelete(room)}
                                                aria-label="Eliminar sala"
                                                title="Eliminar"
                                            >
                                                <IconTrash size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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