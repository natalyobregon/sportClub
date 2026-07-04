import { Link, Outlet } from "react-router-dom"

function UserLayout() {
    return (
        <div>
            <nav>
                <Link to="/">Inicio</Link> |
                <Link to="/user/dashboard">Dashboard Usuario</Link> |
                <Link to="/user/classes">Clases Disponibles</Link> |
                <Link to="/user/reservations">Mis Reservas</Link> |
                <Link to="/user/profile">Mi Perfil</Link>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default UserLayout