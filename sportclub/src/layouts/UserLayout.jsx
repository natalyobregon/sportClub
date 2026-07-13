import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"
import { logout, getUser } from "../services/authService"
import Topbar from "../componentes/ui/Topbar"
import { IconHome, IconActivity, IconClipboard, IconUser, IconLogOut } from "../componentes/ui/Icons"

const navLinkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-2${isActive ? " active-nav-link" : ""}`

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
                <div className="mb-4">
                    <span className="wordmark" style={{ fontSize: "18px" }}>
                        SPORT<span className="wordmark-accent">CLUB</span>
                    </span>
                    <div className="small" style={{ opacity: 0.7, letterSpacing: "2px", fontSize: "10px" }}>MI CUENTA</div>
                </div>

                <nav className="d-flex flex-column gap-1 mb-4">
                    <NavLink end className={navLinkClass} to="/user/dashboard"><IconHome size={16} /> Inicio</NavLink>
                    <NavLink className={navLinkClass} to="/user/classes"><IconActivity size={16} /> Clases Disponibles</NavLink>
                    <NavLink className={navLinkClass} to="/user/reservations"><IconClipboard size={16} /> Mis Reservas</NavLink>
                    <NavLink className={navLinkClass} to="/user/profile"><IconUser size={16} /> Mi Perfil</NavLink>
                </nav>

                <div style={{ marginTop: "auto" }}>
                    <div className="small mb-2">{user?.full_name}</div>
                    <Button variant="outline-light" size="sm" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
                        <IconLogOut size={15} /> Cerrar sesión
                    </Button>
                </div>
            </aside>

            <div className="flex-fill d-flex flex-column">
                <Topbar profilePath="/user/profile" />
                <main className="flex-fill p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default UserLayout

