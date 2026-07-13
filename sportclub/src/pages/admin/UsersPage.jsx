import { useEffect, useState } from "react"
import { Button, Card, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import UserFormModal from "../../componentes/users/UserFormModal"
import { IconPlus, IconEdit, IconTrash, IconUsers } from "../../componentes/ui/Icons"

import {
    createUser,
    deleteUser,
    getUsers,
    updateUser,
} from "../../services/userService"

const ROLE_LABELS = {
    admin: "Administrador",
    coach: "Coach",
    user: "Usuario"
}

function getInitials(name) {
    if (!name) return "?"
    const parts = name.trim().split(" ").filter(Boolean)
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase()
}

function UsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const loadUsers = async () => {
        try {
            setLoading(true)
            const data = await getUsers()
            setUsers(data.data || data)
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const openCreateModal = () => {
        setSelectedUser(null)
        setShowModal(true)
    }

    const openEditModal = (user) => {
        setSelectedUser(user)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedUser(null)
    }

    const handleSave = async (formData) => {
        try {
            if (selectedUser) {
                await updateUser(selectedUser.id, formData)
                Swal.fire("Actualizado", "Usuario actualizado correctamente", "success")
            } else {
                await createUser(formData)
                Swal.fire("Creado", "Usuario creado correctamente", "success")
            }
            closeModal()
            loadUsers()
        } catch (error) {
            Swal.fire("Error", error.message, "error")
        }
    }

    const handleDelete = async (user) => {
        const result = await Swal.fire({
            title: "¿Eliminar usuario?",
            text: `Se eliminará a ${user.full_name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
        })

        if (result.isConfirmed) {
            try {
                await deleteUser(user.id)
                Swal.fire("Eliminado", "Usuario eliminado correctamente", "success")
                loadUsers()
            } catch (error) {
                Swal.fire("Error", error.message, "error")
            }
        }
    }

    return (
        <Card className="card-modern">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0" style={{ fontWeight: 700 }}>Gestión de Usuarios</h4>
                    <div className="small text-muted">{users.length} usuarios registrados</div>
                </div>
                <Button className="btn-brand-primary d-flex align-items-center gap-2" onClick={openCreateModal}>
                    <IconPlus size={16} /> Nuevo Usuario
                </Button>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando usuarios...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        <IconUsers size={28} />
                        <p className="mt-2 mb-0">Aún no hay usuarios registrados.</p>
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th style={{ textAlign: "right" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="avatar-badge"
                                                    style={{ background: "#EEEDFE", color: "var(--brand-purple)" }}
                                                >
                                                    {getInitials(user.full_name)}
                                                </div>
                                                <span>{user.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted">{user.email}</td>
                                        <td>
                                            <span className={`role-pill role-pill-${user.role}`}>
                                                {ROLE_LABELS[user.role] || user.role}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                type="button"
                                                className="icon-action-btn me-2"
                                                onClick={() => openEditModal(user)}
                                                aria-label="Editar usuario"
                                                title="Editar"
                                            >
                                                <IconEdit size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                className="icon-action-btn danger"
                                                onClick={() => handleDelete(user)}
                                                aria-label="Eliminar usuario"
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

            <UserFormModal
                show={showModal}
                handleClose={closeModal}
                handleSave={handleSave}
                selectedUser={selectedUser}
            />
        </Card>
    )
}

export default UsersPage
                                           