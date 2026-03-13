interface StatusBadgeProps {
    status: "pendiente" | "aprobada" | "otro";
}

const labels: Record<string, string> = {
    pendiente: "Pendiente",
    aprobada: "Aprobada",
    otro: "Otro",
};

export function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={`status-badge ${status}`}>
            <span className="status-badge-dot"></span>
            {labels[status] || status}
        </span>
    );
}
