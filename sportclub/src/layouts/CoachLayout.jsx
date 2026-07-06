import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"
import { logout, getUser } from "../services/authService"
import logo from "../assets/logo.png"

function CoachLayout() {
    const navigate = useNavigate()
    const user = getUser()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <div className="d-flex">
            <aside className="role-sidebar" style={{ backgroundColor: "var(--role-coach-a)" }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                    <img src={logo} alt="SportClub" className="brand-crest" style={{ width: "32px", height: "32px" }} />
                    <span className="brand-heading" style={{ fontSize: "12px" }}>SportClub</span>
                </div>
                <div className="small mb-4" style={{ opacity: 0.7, letterSpacing: "1px" }}>COACH</div>

                <nav className="d-flex flex-column gap-1 mb-4">
                    <Link className="nav-link" to="/coach/dashboard">Dashboard</Link>
                    <Link className="nav-link" to="/coach/my-classes">Mis Clases</Link>
                    <Link className="nav-link" to="/coach/my-schedule">Mi Horario</Link>
                    <Link className="nav-link" to="/coach/profile">Mi Perfil</Link>
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
export default CoachLayout
