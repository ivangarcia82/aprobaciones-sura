import { NextResponse } from "next/server";
import {
    fetchDraftOrder,
    updateDraftOrderTags,
    replaceTag,
} from "@/lib/shopify";
import { sendApprovalEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id, 10);

        // Fetch the current order
        const order = await fetchDraftOrder(orderId);

        // Replace "Pendiente Aprobación" tag with "Aprobada"
        const newTags = replaceTag(order.tags, "Pendiente Aprobación", "Aprobada");

        // Update the draft order
        const updatedOrder = await updateDraftOrderTags(orderId, newTags);

        // Send notification email
        try {
            await sendApprovalEmail(updatedOrder);
        } catch (emailError) {
            console.error("Error sending email (order still approved):", emailError);
        }

        return NextResponse.json({
            success: true,
            order: updatedOrder,
            message: "Orden aprobada exitosamente",
        });
    } catch (error) {
        console.error("Error approving order:", error);
        return NextResponse.json(
            { error: "Error al aprobar la orden" },
            { status: 500 }
        );
    }
}
