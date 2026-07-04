import { useEffect, useState } from "react"
import { Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import SportRoomFormModal from "../../componentes/sportRooms/SportRoomFormModal"

import {
    createSportRoom,
    deleteSportRoom,
    getSportRooms,
    updateSportRoom,
} from "../../services/sportRoomService"

function AssignmentsPage() {
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState(null)

    const loadAssignments = async () => {
        try {
            setLoading(true)
            const data = await getSportRooms()
            setAssignments(data.data || data)
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAssignments()
    }, [])

    const openCreateModal = () => {
        setSelectedAssignment(null)
        setShowModal(true)
    }

    const openEditModal = (assignment) => {
        setSelectedAssignment(assignment)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedAssignment(null)
    }

    const handleSave = async (formData) => {
        try {
            if (selectedAssignment) {
                await updateSportRoom(selectedAssignment.id, formData)
                Swal.fire("Actualizada", "Asignación actualizada correctamente", "success")
            } else {
                await createSportRoom(formData)
                Swal.fire("Creada", "Asignación creada correctamente", "success")
            }
            closeModal()
            loadAssignments()
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        }
    }

    const handleDelete = async (assignment) => {
        const result = await Swal.fire({
            title: "¿Eliminar asignación?",
            text: `Se eliminará la asignación de "${assignment.sport?.name}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
        })

        if (result.isConfirmed) {
            try {
                await deleteSportRoom(assignment.id)
                Swal.fire("Eliminada", "Asignación eliminada correctamente", "success")
                loadAssignments()
            } catch (error) {
                Swal.fire("Error", error.message, "error")
            }
        }
    }

    return (
        <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Gestión de Asignaciones</h4>
                <Button variant="primary" onClick={openCreateModal}>
                    Nueva Asignación
                </Button>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando asignaciones...</p>
                    </div>
                ) : (
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Deporte</th>
                                <th>Sala</th>
                                <th>Coach</th>
                                <th>Observación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((assignment) => (
                                <tr key={assignment.id}>
                                    <td>{assignment.id}</td>
                                    <td>{assignment.sport?.name}</td>
                                    <td>{assignment.room?.name}</td>
                                    <td>{assignment.coach?.full_name || assignment.coach?.email}</td>
                                    <td>{assignment.observation || "-"}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => openEditModal(assignment)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(assignment)}
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

            <SportRoomFormModal
                show={showModal}
                handleClose={closeModal}
                handleSave={handleSave}
                selectedSportRoom={selectedAssignment}
            />
        </Card>
    )
}

export default AssignmentsPage