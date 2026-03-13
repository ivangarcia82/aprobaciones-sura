import { NextResponse } from "next/server";
import { fetchDraftOrder } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const order = await fetchDraftOrder(parseInt(id, 10));
        return NextResponse.json({ order });
    } catch (error) {
        console.error("Error fetching draft order:", error);
        return NextResponse.json(
            { error: "Error al obtener la orden" },
            { status: 500 }
        );
    }
}
