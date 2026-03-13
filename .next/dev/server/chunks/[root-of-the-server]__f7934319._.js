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
"[project]/src/app/api/draft-orders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/shopify.ts [app-route] (ecmascript)");
;
;
const dynamic = "force-dynamic";
async function GET() {
    try {
        const orders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchDraftOrders"])();
        const summary = {
            total: orders.length,
            pendientes: orders.filter((o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrderStatus"])(o.tags) === "pendiente").length,
            aprobadas: orders.filter((o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrderStatus"])(o.tags) === "aprobada").length,
            urgentes: orders.filter((o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isOrderUrgent"])(o.tags)).length
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            orders,
            summary
        });
    } catch (error) {
        console.error("Error fetching draft orders:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Error al obtener las órdenes"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f7934319._.js.map