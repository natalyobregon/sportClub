import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"
import { logout, getUser } from "../services/authService"
import logo from "../assets/logo.png"

function UserLayout() {
    const navigate = useNavigate()
    const user = getUser()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <div className="d-flex">
            <aside className="role-sidebar" style={{ backgroundColor: "var(--role-user-a)" }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                    <img src={logo} alt="SportClub" className="brand-crest" style={{ width: "32px", height: "32px" }} />
                    <span className="brand-heading" style={{ fontSize: "12px" }}>SportClub</span>
                </div>
                <div className="small mb-4" style={{ opacity: 0.7, letterSpacing: "1px" }}>MI CUENTA</div>

                <nav className="d-flex flex-column gap-1 mb-4">
                    <Link className="nav-link" to="/user/dashboard">Dashboard</Link>
                    <Link className="nav-link" to="/user/classes">Clases Disponibles</Link>
                    <Link className="nav-link" to="/user/reservations">Mis Reservas</Link>
                    <Link className="nav-link" to="/user/profile">Mi Perfil</Link>
                </nav>

                <div style={{ marginTop: "auto" }}>
                    <div className="small mb-2">{user?.full_name}</div>
                    <Button variant="outline-light" size="sm" className="w-100" onClick={handleLogout}>
                        Cerrar sesión
                    </Button>
                </div>
            </aside>

            <main className="flex-fill p-4">
                <Outlet />
            </main>
        </div>
    )
}
export default UserLayout
