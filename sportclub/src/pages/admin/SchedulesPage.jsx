import { useEffect, useState } from "react"
import { Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import ClassScheduleFormModal from "../../componentes/schedules/ClassScheduleFormModal"
import { getDayLabel } from "../../utils/dayOfWeek"

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
        <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Gestión de Horarios</h4>
                <Button variant="primary" onClick={openCreateModal}>
                    Nuevo Horario
                </Button>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando horarios...</p>
                    </div>
                ) : (
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Deporte</th>
                                <th>Sala</th>
                                <th>Coach</th>
                                <th>Día</th>
                                <th>Inicio</th>
                                <th>Término</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule) => (
                                <tr key={schedule.id}>
                                    <td>{schedule.id}</td>
                                    <td>{schedule.sportRoom?.sport?.name}</td>
                                    <td>{schedule.sportRoom?.room?.name}</td>
                                    <td>
                                        {schedule.sportRoom?.coach?.full_name ||
                                            schedule.sportRoom?.coach?.email}
                                    </td>
                                    <td>{getDayLabel(schedule.day_of_week)}</td>
                                    <td>{schedule.start_time?.substring(0, 5)}</td>
                                    <td>{schedule.end_time?.substring(0, 5)}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => openEditModal(schedule)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(schedule)}
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