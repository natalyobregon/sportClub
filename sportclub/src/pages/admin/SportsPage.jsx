import { useEffect, useState } from "react"
import { Badge, Button, Card, Form, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import SportFormModal from "../../componentes/sports/SportFormModal"

import {
    createSport,
    deleteSport,
    getSports,
    updateSport,
    changeSportStatus,
} from "../../services/sportService"

function SportsPage() {
    const [sports, setSports] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedSport, setSelectedSport] = useState(null)

    const loadSports = async () => {
        try {
            setLoading(true)
            const data = await getSports()
            setSports(data.data || data)
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSports()
    }, [])

    const openCreateModal = () => {
        setSelectedSport(null)
        setShowModal(true)
    }

    const openEditModal = (sport) => {
        setSelectedSport(sport)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedSport(null)
    }

    const handleSave = async (formData) => {
        try {
            if (selectedSport) {
                await updateSport(selectedSport.id, formData)
                Swal.fire("Actualizado", "Deporte actualizado correctamente", "success")
            } else {
                await createSport(formData)
                Swal.fire("Creado", "Deporte creado correctamente", "success")
            }
            closeModal()
            loadSports()
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        }
    }

    const handleDelete = async (sport) => {
        const result = await Swal.fire({
            title: "¿Eliminar deporte?",
            text: `Se eliminará "${sport.name}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
        })

        if (result.isConfirmed) {
            try {
                await deleteSport(sport.id)
                Swal.fire("Eliminado", "Deporte eliminado correctamente", "success")
                loadSports()
            } catch (error) {
                Swal.fire("Error", error.message, "error")
            }
        }
    }

    const handleToggleStatus = async (sport) => {
        try {
            await changeSportStatus(sport.id, !sport.status)
            loadSports()
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        }
    }

    return (
        <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Gestión de Deportes</h4>
                <Button variant="primary" onClick={openCreateModal}>
                    Nuevo Deporte
                </Button>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando deportes...</p>
                    </div>
                ) : (
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Objetivo</th>
                                <th>Duración</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sports.map((sport) => (
                                <tr key={sport.id}>
                                    <td>{sport.id}</td>
                                    <td>{sport.name}</td>
                                    <td>{sport.objective}</td>
                                    <td>{sport.duration} min</td>
                                    <td>
                                        <Form.Check
                                            type="switch"
                                            checked={!!sport.status}
                                            onChange={() => handleToggleStatus(sport)}
                                            label={
                                                <Badge bg={sport.status ? "success" : "secondary"}>
                                                    {sport.status ? "Activo" : "Inactivo"}
                                                </Badge>
                                            }
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => openEditModal(sport)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(sport)}
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

            <SportFormModal
                show={showModal}
                handleClose={closeModal}
                handleSave={handleSave}
                selectedSport={selectedSport}
            />
        </Card>
    )
}

export default SportsPage