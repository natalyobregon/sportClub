// Set de íconos SVG livianos, sin dependencias externas nuevas.
// Todos aceptan `size` y `className` y usan currentColor para heredar el color del texto.

const base = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
}

function Svg({ size = 16, className = "", children }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
            {children}
        </svg>
    )
}

export function IconUser(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="8" r="3.6" />
            <path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
        </Svg>
    )
}

export function IconMail(props) {
    return (
        <Svg {...props}>
            <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
            <path d="M4 7l8 6 8-6" />
        </Svg>
    )
}

export function IconLock(props) {
    return (
        <Svg {...props}>
            <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
            <path d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5" />
        </Svg>
    )
}

export function IconShield(props) {
    return (
        <Svg {...props}>
            <path d="M12 3.5l7 2.6v5.4c0 4.6-3 7.9-7 9-4-1.1-7-4.4-7-9V6.1l7-2.6z" />
        </Svg>
    )
}

export function IconCalendar(props) {
    return (
        <Svg {...props}>
            <rect x="3.5" y="5.5" width="17" height="15" rx="2.2" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
        </Svg>
    )
}

export function IconCamera(props) {
    return (
        <Svg {...props}>
            <path d="M4 8h3l1.6-2.2h6.8L17 8h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 4 8z" />
            <circle cx="12" cy="13" r="3.4" />
        </Svg>
    )
}

export function IconX(props) {
    return (
        <Svg {...props}>
            <path d="M6 6l12 12M18 6L6 18" />
        </Svg>
    )
}

export function IconEdit(props) {
    return (
        <Svg {...props}>
            <path d="M4 20l.9-4.2L15.4 5.3a1.8 1.8 0 0 1 2.6 0l1.7 1.7a1.8 1.8 0 0 1 0 2.6L9.2 19.1 4 20z" />
        </Svg>
    )
}

export function IconTrash(props) {
    return (
        <Svg {...props}>
            <path d="M5 7h14M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7M7 7l1 12.3A1.5 1.5 0 0 0 9.5 21h5a1.5 1.5 0 0 0 1.5-1.7L17 7" />
        </Svg>
    )
}

export function IconPlus(props) {
    return (
        <Svg {...props}>
            <path d="M12 5v14M5 12h14" />
        </Svg>
    )
}

export function IconUsers(props) {
    return (
        <Svg {...props}>
            <circle cx="9" cy="8" r="3" />
            <path d="M2.5 19c1.1-3 3.4-4.6 6.5-4.6S14.4 16 15.5 19" />
            <path d="M15.5 8.3a2.7 2.7 0 1 1 0 5.3" />
            <path d="M17 14.6c2.3.4 3.7 1.8 4.5 4.4" />
        </Svg>
    )
}

export function IconActivity(props) {
    return (
        <Svg {...props}>
            <path d="M3 12h4l2.2-7 4 14 2-9.5 1.4 2.5H21" />
        </Svg>
    )
}

export function IconLayout(props) {
    return (
        <Svg {...props}>
            <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
            <path d="M3.5 9.5h17" />
        </Svg>
    )
}

export function IconClipboard(props) {
    return (
        <Svg {...props}>
            <rect x="5.5" y="5" width="13" height="16" rx="2" />
            <path d="M9 5V4a1.3 1.3 0 0 1 1.3-1.3h3.4A1.3 1.3 0 0 1 15 4v1" />
            <path d="M9 11h6M9 15h6" />
        </Svg>
    )
}

export function IconClock(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="8.3" />
            <path d="M12 7.5V12l3 2" />
        </Svg>
    )
}

export function IconHome(props) {
    return (
        <Svg {...props}>
            <path d="M4 11.5L12 4l8 7.5" />
            <path d="M6 10v9.5h12V10" />
        </Svg>
    )
}

export function IconLogOut(props) {
    return (
        <Svg {...props}>
            <path d="M10 4H6a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 6 20h4" />
            <path d="M15.5 16l4-4-4-4M19 12H9" />
        </Svg>
    )
}

export function IconDoor(props) {
    return (
        <Svg {...props}>
            <rect x="6" y="3" width="12" height="18" rx="1.5" />
            <circle cx="14.2" cy="12" r="0.9" fill="currentColor" stroke="none" />
        </Svg>
    )
}

export function IconWhistle(props) {
    return (
        <Svg {...props}>
            <circle cx="9" cy="14.5" r="4.5" />
            <path d="M12.7 11.3L20 6M17 4.5l3 3M9 12.5v4" />
        </Svg>
    )
}

export function IconChevronRight(props) {
    return (
        <Svg {...props}>
            <path d="M9 6l6 6-6 6" />
        </Svg>
    )
}
