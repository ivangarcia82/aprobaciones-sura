import { NextResponse } from "next/server";
import { fetchDraftOrders, getOrderStatus, isOrderUrgent } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const orders = await fetchDraftOrders();

        const summary = {
            total: orders.length,
            pendientes: orders.filter((o) => getOrderStatus(o.tags) === "pendiente")
                .length,
            aprobadas: orders.filter((o) => getOrderStatus(o.tags) === "aprobada")
                .length,
            urgentes: orders.filter((o) => isOrderUrgent(o.tags)).length,
        };

        return NextResponse.json({ orders, summary });
    } catch (error) {
        console.error("Error fetching draft orders:", error);
        return NextResponse.json(
            { error: "Error al obtener las órdenes" },
            { status: 500 }
        );
    }
}
