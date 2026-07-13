import { Link } from "react-router-dom"
import { getUser } from "../../services/authService"

function getInitials(name) {
    if (!name) return "?"
    const parts = name.trim().split(" ").filter(Boolean)
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase()
}

function Topbar({ profilePath }) {
    const user = getUser()
    const avatar = user?.metadata?.avatar

    return (
        <div className="app-topbar">
            <Link to={profilePath} className="topbar-avatar-link">
                <span className="d-none d-sm-inline small text-muted">{user?.full_name}</span>
                <span className="topbar-avatar-circle">
                    {avatar ? <img src={avatar} alt="Foto de perfil" /> : getInitials(user?.full_name)}
                </span>
            </Link>
        </div>
    )
}

export default Topbar
