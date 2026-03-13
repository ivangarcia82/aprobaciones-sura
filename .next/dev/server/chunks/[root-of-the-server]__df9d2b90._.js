module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/shopify.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchDraftOrder",
    ()=>fetchDraftOrder,
    "fetchDraftOrders",
    ()=>fetchDraftOrders,
    "getOrderStatus",
    ()=>getOrderStatus,
    "isOrderUrgent",
    ()=>isOrderUrgent,
    "replaceTag",
    ()=>replaceTag,
    "updateDraftOrderTags",
    ()=>updateDraftOrderTags
]);
const SHOPIFY_SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = "2024-01";
const BASE_URL = `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API_VERSION}`;
async function shopifyFetch(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
            ...options.headers
        }
    });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Shopify API error ${res.status}: ${errorBody}`);
    }
    return res.json();
}
async function fetchDraftOrders() {
    // Fetch all draft orders and filter by tag "Venta Corporativa"
    const allOrders = [];
    let pageInfo = null;
    let hasNextPage = true;
    while(hasNextPage){
        const params = new URLSearchParams({
            limit: "250",
            status: "open"
        });
        let url = `/draft_orders.json?${params.toString()}`;
        if (pageInfo) {
            url = `/draft_orders.json?limit=250&page_info=${pageInfo}`;
        }
        const response = await shopifyFetch(url);
        const orders = response.draft_orders || [];
        // Filter for "Venta Corporativa" tag
        const corporateOrders = orders.filter((order)=>{
            const tags = order.tags.split(",").map((t)=>t.trim().toLowerCase());
            return tags.includes("venta corporativa");
        });
        allOrders.push(...corporateOrders);
        // Check for pagination - simplified, most stores won't have > 250 corporate orders
        hasNextPage = false;
    }
    // Sort by created_at descending
    allOrders.sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return allOrders;
}
async function fetchDraftOrder(id) {
    const response = await shopifyFetch(`/draft_orders/${id}.json`);
    return response.draft_order;
}
async function updateDraftOrderTags(id, newTags) {
    const response = await shopifyFetch(`/draft_orders/${id}.json`, {
        method: "PUT",
        body: JSON.stringify({
            draft_order: {
                id,
                tags: newTags
            }
        })
    });
    return response.draft_order;
}
function getOrderStatus(tags) {
    const tagList = tags.split(",").map((t)=>t.trim().toLowerCase());
    if (tagList.includes("aprobada")) return "aprobada";
    if (tagList.includes("pendiente aprobación")) return "pendiente";
    return "otro";
}
function isOrderUrgent(tags) {
    const tagList = tags.split(",").map((t)=>t.trim().toLowerCase());
    return tagList.includes("urgente");
}
function replaceTag(tags, oldTag, newTag) {
    const tagList = tags.split(",").map((t)=>t.trim());
    const updatedTags = tagList.map((t)=>t.toLowerCase() === oldTag.toLowerCase() ? newTag : t);
    return updatedTags.join(", ");
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/lib/email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendApprovalEmail",
    ()=>sendApprovalEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
;
const resend = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const TO_EMAIL = process.env.TO_EMAIL || "igarcia@generandoideas.com";
async function sendApprovalEmail(order) {
    const customerName = order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : "Sin cliente asignado";
    const companyName = order.customer?.company || order.shipping_address?.company || "";
    const lineItemsHtml = order.line_items.map((item)=>`
      <tr>
        <td style="padding: 10px 16px; border-bottom: 1px solid #eee; font-size: 14px; color: #333;">${item.title}${item.variant_title ? ` — ${item.variant_title}` : ""}</td>
        <td style="padding: 10px 16px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 16px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; text-align: right;">$${parseFloat(item.price).toFixed(2)} ${order.currency}</td>
      </tr>
    `).join("");
    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [
            TO_EMAIL
        ],
        subject: `✅ Orden Corporativa Aprobada: ${order.name}${companyName ? ` — ${companyName}` : ""}`,
        html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">Orden Corporativa Aprobada</h1>
          <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">${order.name}</p>
        </div>
        
        <div style="padding: 24px;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 600;">
              ✅ Esta orden ha sido aprobada exitosamente.
            </p>
          </div>

          <h2 style="font-size: 16px; color: #1a1a2e; margin: 0 0 12px 0;">Información del Cliente</h2>
          <table style="width: 100%; margin-bottom: 24px;">
            <tr>
              <td style="padding: 4px 0; font-size: 14px; color: #64748b;">Cliente:</td>
              <td style="padding: 4px 0; font-size: 14px; color: #1e293b; font-weight: 500;">${customerName}</td>
            </tr>
            ${companyName ? `<tr>
              <td style="padding: 4px 0; font-size: 14px; color: #64748b;">Empresa:</td>
              <td style="padding: 4px 0; font-size: 14px; color: #1e293b; font-weight: 500;">${companyName}</td>
            </tr>` : ""}
            ${order.customer?.email ? `<tr>
              <td style="padding: 4px 0; font-size: 14px; color: #64748b;">Email:</td>
              <td style="padding: 4px 0; font-size: 14px; color: #1e293b; font-weight: 500;">${order.customer.email}</td>
            </tr>` : ""}
          </table>

          <h2 style="font-size: 16px; color: #1a1a2e; margin: 0 0 12px 0;">Productos</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 10px 16px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Producto</th>
                <th style="padding: 10px 16px; text-align: center; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Cant.</th>
                <th style="padding: 10px 16px; text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Precio</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHtml}
            </tbody>
          </table>

          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; text-align: right;">
            <p style="margin: 4px 0; font-size: 14px; color: #64748b;">Subtotal: <strong style="color: #1e293b;">$${parseFloat(order.subtotal_price).toFixed(2)} ${order.currency}</strong></p>
            <p style="margin: 4px 0; font-size: 14px; color: #64748b;">Impuestos: <strong style="color: #1e293b;">$${parseFloat(order.total_tax).toFixed(2)} ${order.currency}</strong></p>
            <p style="margin: 8px 0 0 0; font-size: 18px; color: #1a1a2e; font-weight: 700;">Total: $${parseFloat(order.total_price).toFixed(2)} ${order.currency}</p>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">Portal de Aprobaciones — Sura</p>
        </div>
      </div>
    `
    });
    if (error) {
        console.error("Error sending approval email:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}
}),
"[project]/src/app/api/draft-orders/[id]/approve/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/shopify.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email.ts [app-route] (ecmascript)");
;
;
;
const dynamic = "force-dynamic";
async function POST(request, { params }) {
    try {
        const { id } = await params;
        const orderId = parseInt(id, 10);
        // Fetch the current order
        const order = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchDraftOrder"])(orderId);
        // Replace "Pendiente Aprobación" tag with "Aprobada"
        const newTags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["replaceTag"])(order.tags, "Pendiente Aprobación", "Aprobada");
        // Update the draft order
        const updatedOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateDraftOrderTags"])(orderId, newTags);
        // Send notification email
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendApprovalEmail"])(updatedOrder);
        } catch (emailError) {
            console.error("Error sending email (order still approved):", emailError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            order: updatedOrder,
            message: "Orden aprobada exitosamente"
        });
    } catch (error) {
        console.error("Error approving order:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Error al aprobar la orden"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__df9d2b90._.js.map