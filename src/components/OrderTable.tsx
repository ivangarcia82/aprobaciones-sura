"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "./StatusBadge";
import { DraftOrder, getOrderStatus, isOrderUrgent } from "@/lib/shopify";
import { useState } from "react";

interface OrderTableProps {
    orders: DraftOrder[];
}

type FilterType = "all" | "pendiente" | "aprobada" | "urgente";

export function OrderTable({ orders }: OrderTableProps) {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterType>("all");

    const filteredOrders =
        filter === "all"
            ? orders
            : filter === "urgente"
                ? orders.filter((o) => isOrderUrgent(o.tags))
                : orders.filter((o) => getOrderStatus(o.tags) === filter);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
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

    return (
        <div className="table-container animate-in animate-in-delay-3">
            <div className="table-header">
                <h2 className="table-title">Órdenes Corporativas</h2>
                <div className="table-filter">
                    <button
                        className={`filter-btn ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        Todas ({orders.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === "pendiente" ? "active" : ""}`}
                        onClick={() => setFilter("pendiente")}
                    >
                        Pendientes (
                        {orders.filter((o) => getOrderStatus(o.tags) === "pendiente").length}
                        )
                    </button>
                    <button
                        className={`filter-btn ${filter === "aprobada" ? "active" : ""}`}
                        onClick={() => setFilter("aprobada")}
                    >
                        Aprobadas (
                        {orders.filter((o) => getOrderStatus(o.tags) === "aprobada").length}
                        )
                    </button>
                    <button
                        className={`filter-btn urgente-filter ${filter === "urgente" ? "active" : ""}`}
                        onClick={() => setFilter("urgente")}
                    >
                        🔴 Urgentes (
                        {orders.filter((o) => isOrderUrgent(o.tags)).length}
                        )
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <div className="empty-state-title">No hay órdenes</div>
                    <div className="empty-state-text">
                        No se encontraron órdenes con el filtro seleccionado.
                    </div>
                </div>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Orden</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr
                                key={order.id}
                                onClick={() => router.push(`/orders/${order.id}`)}
                                className={isOrderUrgent(order.tags) ? "urgent-row" : ""}
                            >
                                <td>
                                    <div className="order-name-cell">
                                        <span className="order-name">{order.name}</span>
                                        {isOrderUrgent(order.tags) && (
                                            <span className="urgent-tag">🔴 Urgente</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="order-customer">
                                        {order.customer
                                            ? `${order.customer.first_name} ${order.customer.last_name}`
                                            : "—"}
                                    </div>
                                    {(order.customer?.company ||
                                        order.shipping_address?.company) && (
                                            <div className="order-company">
                                                {order.customer?.company ||
                                                    order.shipping_address?.company}
                                            </div>
                                        )}
                                </td>
                                <td>
                                    <span className="order-amount">
                                        {formatCurrency(order.total_price, order.currency)}
                                    </span>
                                </td>
                                <td>
                                    <StatusBadge status={getOrderStatus(order.tags)} />
                                </td>
                                <td>
                                    <span className="order-date">
                                        {formatDate(order.created_at)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

