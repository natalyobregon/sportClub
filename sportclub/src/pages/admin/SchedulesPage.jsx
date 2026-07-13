import { useEffect, useState } from "react"
import { Button, Card, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import ClassScheduleFormModal from "../../componentes/schedules/ClassScheduleFormModal"
import { getDayLabel } from "../../utils/dayOfWeek"
import { IconPlus, IconEdit, IconTrash, IconClock } from "../../componentes/ui/Icons"

import {
    createClassSchedule,
    deleteClassSchedule,
    getClassSchedules,
    updateClassSchedule,
} from "../../services/classScheduleService"

function SchedulesPage() {
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedSchedule, setSelectedSchedule] = useState(null)

    const loadSchedules = async () => {
        try {
            setLoading(true)
            const data = await getClassSchedules()
            setSchedules(data.data || data)
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSchedules()
    }, [])

    const openCreateModal = () => {
        setSelectedSchedule(null)
        setShowModal(true)
    }

    const openEditModal = (schedule) => {
        setSelectedSchedule(schedule)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedSchedule(null)
    }

    const handleSave = async (formData) => {
        try {
            if (selectedSchedule) {
                await updateClassSchedule(selectedSchedule.id, formData)
                Swal.fire("Actualizado", "Horario actualizado correctamente", "success")
            } else {
                await createClassSchedule(formData)
                Swal.fire("Creado", "Horario creado correctamente", "success")
            }
            closeModal()
            loadSchedules()
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        }
    }

    const handleDelete = async (schedule) => {
        const result = await Swal.fire({
            title: "¿Eliminar horario?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
        })

        if (result.isConfirmed) {
            try {
                await deleteClassSchedule(schedule.id)
                Swal.fire("Eliminado", "Horario eliminado correctamente", "success")
                loadSchedules()
            } catch (error) {
                Swal.fire("Error", error.message, "error")
            }
        }
    }

    return (
        <Card className="card-modern">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0" style={{ fontWeight: 700 }}>Gestión de Horarios</h4>
                    <div className="small text-muted">{schedules.length} horarios programados</div>
                </div>
                <Button className="btn-brand-primary d-flex align-items-center gap-2" onClick={openCreateModal}>
                    <IconPlus size={16} /> Nuevo Horario
                </Button>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando horarios...</p>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        <IconClock size={28} />
                        <p className="mt-2 mb-0">Aún no hay horarios programados.</p>
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Deporte</th>
                                    <th>Sala</th>
                                    <th>Coach</th>
                                    <th>Día</th>
                                    <th>Horario</th>
                                    <th style={{ textAlign: "right" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="avatar-badge"
                                                    style={{ background: "#E8F0FE", color: "#1D4ED8" }}
                                                >
                                                    <IconClock size={14} />
                                                </div>
                                                <span>{schedule.sportRoom?.sport?.name}</span>
                                            </div>
                                        </td>
                                        <td>{schedule.sportRoom?.room?.name}</td>
                                        <td className="text-muted">
                                            {schedule.sportRoom?.coach?.full_name || schedule.sportRoom?.coach?.email}
                                        </td>
                                        <td>
                                            <span className="status-pill status-pill-active">
                                                {getDayLabel(schedule.day_of_week)}
                                            </span>
                                        </td>
                                        <td className="text-muted">
                                            {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                type="button"
                                                className="icon-action-btn me-2"
                                                onClick={() => openEditModal(schedule)}
                                                aria-label="Editar horario"
                                                title="Editar"
                                            >
                                                <IconEdit size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                className="icon-action-btn danger"
                                                onClick={() => handleDelete(schedule)}
                                                aria-label="Eliminar horario"
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

            <ClassScheduleFormModal
                show={showModal}
                handleClose={closeModal}
                handleSave={handleSave}
                selectedSchedule={selectedSchedule}
            />
        </Card>
    )
}

export default SchedulesPage