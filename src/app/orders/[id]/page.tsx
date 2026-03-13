"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { DraftOrder, getOrderStatus } from "@/lib/shopify";
import { StatusBadge } from "@/components/StatusBadge";
import { ApproveButton } from "@/components/ApproveButton";

export default function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [order, setOrder] = useState<DraftOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/draft-orders/${id}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            setOrder(json.order);
        } catch {
            setError("Error al cargar la orden.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: string, currency: string) => {
        return `$${parseFloat(amount).toLocaleString("es-MX", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ${currency}`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Cargando detalle de la orden...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">⚠️</div>
                <div className="empty-state-title">
                    {error || "Orden no encontrada"}
                </div>
                <Link href="/" className="detail-back" style={{ marginTop: 16 }}>
                    ← Volver al Dashboard
                </Link>
            </div>
        );
    }

    const status = getOrderStatus(order.tags);

    return (
        <>
            <Link href="/" className="detail-back">
                ← Volver al Dashboard
            </Link>

            <div className="detail-header animate-in">
                <div className="detail-header-left">
                    <h1 className="detail-order-name">{order.name}</h1>
                    <StatusBadge status={status} />
                </div>
                <ApproveButton
                    orderId={order.id}
                    isApproved={status === "aprobada"}
                    onApproved={fetchOrder}
                />
            </div>

            <div className="detail-grid animate-in animate-in-delay-1">
                <div className="detail-card">
                    <h3 className="detail-card-title">Información del Cliente</h3>
                    {order.customer ? (
                        <>
                            <div className="detail-field">
                                <div className="detail-field-label">Nombre</div>
                                <div className="detail-field-value">
                                    {order.customer.first_name} {order.customer.last_name}
                                </div>
                            </div>
                            {order.customer.email && (
                                <div className="detail-field">
                                    <div className="detail-field-label">Email</div>
                                    <div className="detail-field-value">
                                        {order.customer.email}
                                    </div>
                                </div>
                            )}
                            {(order.customer.company ||
                                order.shipping_address?.company) && (
                                    <div className="detail-field">
                                        <div className="detail-field-label">Empresa</div>
                                        <div className="detail-field-value">
                                            {order.customer.company ||
                                                order.shipping_address?.company}
                                        </div>
                                    </div>
                                )}
                            {order.customer.phone && (
                                <div className="detail-field">
                                    <div className="detail-field-label">Teléfono</div>
                                    <div className="detail-field-value">
                                        {order.customer.phone}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="detail-field-value" style={{ color: "var(--text-muted)" }}>
                            Sin cliente asignado
                        </div>
                    )}
                </div>

                <div className="detail-card">
                    <h3 className="detail-card-title">Detalles de la Orden</h3>
                    <div className="detail-field">
                        <div className="detail-field-label">Fecha de Creación</div>
                        <div className="detail-field-value">
                            {formatDate(order.created_at)}
                        </div>
                    </div>
                    <div className="detail-field">
                        <div className="detail-field-label">Última Actualización</div>
                        <div className="detail-field-value">
                            {formatDate(order.updated_at)}
                        </div>
                    </div>
                    <div className="detail-field">
                        <div className="detail-field-label">Tags</div>
                        <div className="detail-field-value">{order.tags}</div>
                    </div>
                    {order.note && (
                        <div className="detail-field">
                            <div className="detail-field-label">Nota</div>
                            <div className="detail-field-value">{order.note}</div>
                        </div>
                    )}
                </div>
            </div>

            {order.shipping_address && (
                <div className="detail-grid animate-in animate-in-delay-2" style={{ marginBottom: 32 }}>
                    <div className="detail-card">
                        <h3 className="detail-card-title">Dirección de Envío</h3>
                        <div className="detail-field">
                            <div className="detail-field-value">
                                {order.shipping_address.first_name}{" "}
                                {order.shipping_address.last_name}
                            </div>
                        </div>
                        {order.shipping_address.company && (
                            <div className="detail-field">
                                <div className="detail-field-value">
                                    {order.shipping_address.company}
                                </div>
                            </div>
                        )}
                        <div className="detail-field">
                            <div className="detail-field-value">
                                {order.shipping_address.address1}
                                {order.shipping_address.address2 &&
                                    `, ${order.shipping_address.address2}`}
                            </div>
                        </div>
                        <div className="detail-field">
                            <div className="detail-field-value">
                                {order.shipping_address.city},{" "}
                                {order.shipping_address.province}{" "}
                                {order.shipping_address.zip}
                            </div>
                        </div>
                        <div className="detail-field">
                            <div className="detail-field-value">
                                {order.shipping_address.country}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="line-items-card animate-in animate-in-delay-2">
                <h3 className="detail-card-title">Productos</h3>
                <table className="line-items-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th style={{ textAlign: "center" }}>Cantidad</th>
                            <th>Precio Unitario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.line_items.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="line-item-title">{item.title}</div>
                                    {item.variant_title && (
                                        <div className="line-item-variant">
                                            {item.variant_title}
                                        </div>
                                    )}
                                    {item.sku && (
                                        <div className="line-item-variant">SKU: {item.sku}</div>
                                    )}
                                </td>
                                <td className="line-item-qty" style={{ textAlign: "center" }}>
                                    {item.quantity}
                                </td>
                                <td>{formatCurrency(item.price, order.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="totals-card animate-in animate-in-delay-3">
                <div className="totals-row">
                    <span className="totals-label">Subtotal</span>
                    <span className="totals-value">
                        {formatCurrency(order.subtotal_price, order.currency)}
                    </span>
                </div>
                <div className="totals-row">
                    <span className="totals-label">Impuestos</span>
                    <span className="totals-value">
                        {formatCurrency(order.total_tax, order.currency)}
                    </span>
                </div>
                <div className="totals-row total">
                    <span className="totals-label">Total</span>
                    <span className="totals-value">
                        {formatCurrency(order.total_price, order.currency)}
                    </span>
                </div>
            </div>
        </>
    );
}
