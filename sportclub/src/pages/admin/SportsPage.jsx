import { useEffect, useState } from "react"
import { Button, Card, Form, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import SportFormModal from "../../componentes/sports/SportFormModal"
import { IconPlus, IconEdit, IconTrash, IconActivity } from "../../componentes/ui/Icons"

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
        <Card className="card-modern">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0" style={{ fontWeight: 700 }}>Gestión de Deportes</h4>
                    <div className="small text-muted">{sports.length} deportes registrados</div>
                </div>
                <Button className="btn-brand-primary d-flex align-items-center gap-2" onClick={openCreateModal}>
                    <IconPlus size={16} /> Nuevo Deporte
                </Button>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando deportes...</p>
                    </div>
                ) : sports.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        <IconActivity size={28} />
                        <p className="mt-2 mb-0">Aún no hay deportes registrados.</p>
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Objetivo</th>
                                    <th>Duración</th>
                                    <th>Estado</th>
                                    <th style={{ textAlign: "right" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sports.map((sport) => (
                                    <tr key={sport.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="avatar-badge"
                                                    style={{ background: "#FFF6D9", color: "#854F0B" }}
                                                >
                                                    <IconActivity size={14} />
                                                </div>
                                                <span>{sport.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted" style={{ maxWidth: "280px" }}>{sport.objective}</td>
                                        <td>{sport.duration} min</td>
                                        <td>
                                            <Form.Check
                                                type="switch"
                                                checked={!!sport.status}
                                                onChange={() => handleToggleStatus(sport)}
                                                label={
                                                    <span className={sport.status ? "status-pill-active status-pill" : "status-pill-inactive status-pill"}>
                                                        {sport.status ? "Activo" : "Inactivo"}
                                                    </span>
                                                }
                                            />
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                type="button"
                                                className="icon-action-btn me-2"
                                                onClick={() => openEditModal(sport)}
                                                aria-label="Editar deporte"
                                                title="Editar"
                                            >
                                                <IconEdit size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                className="icon-action-btn danger"
                                                onClick={() => handleDelete(sport)}
                                                aria-label="Eliminar deporte"
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
