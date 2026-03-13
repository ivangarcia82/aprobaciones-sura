"use client";

import { useState } from "react";

interface ApproveButtonProps {
    orderId: number;
    isApproved: boolean;
    onApproved?: () => void;
}

export function ApproveButton({
    orderId,
    isApproved,
    onApproved,
}: ApproveButtonProps) {
    const [loading, setLoading] = useState(false);
    const [approved, setApproved] = useState(isApproved);
    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleApprove = async () => {
        if (approved || loading) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/draft-orders/${orderId}/approve`, {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setApproved(true);
                setToast({ type: "success", message: "✅ Orden aprobada exitosamente" });
                onApproved?.();
            } else {
                setToast({
                    type: "error",
                    message: data.error || "Error al aprobar la orden",
                });
            }
        } catch {
            setToast({ type: "error", message: "Error de conexión" });
        } finally {
            setLoading(false);
            setTimeout(() => setToast(null), 4000);
        }
    };

    if (approved) {
        return (
            <div className="approved-badge">
                ✅ Aprobada
            </div>
        );
    }

    return (
        <>
            <button
                className={`approve-btn ${loading ? "loading" : ""}`}
                onClick={handleApprove}
                disabled={loading}
            >
                {!loading && "✓ Aprobar Orden"}
            </button>

            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </>
    );
}
