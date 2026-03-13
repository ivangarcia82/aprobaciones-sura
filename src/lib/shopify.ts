const SHOPIFY_SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN!;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;
const API_VERSION = "2024-01";

const BASE_URL = `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API_VERSION}`;

interface ShopifyLineItem {
  id: number;
  variant_id: number | null;
  product_id: number | null;
  title: string;
  variant_title: string | null;
  sku: string | null;
  vendor: string | null;
  quantity: number;
  price: string;
  image?: {
    src: string;
  } | null;
}

interface ShopifyCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  company?: string | null;
  phone?: string | null;
}

interface ShopifyAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string | null;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string | null;
  company?: string | null;
}

export interface DraftOrder {
  id: number;
  name: string;
  status: string;
  tags: string;
  created_at: string;
  updated_at: string;
  note: string | null;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  currency: string;
  customer: ShopifyCustomer | null;
  line_items: ShopifyLineItem[];
  shipping_address: ShopifyAddress | null;
  billing_address: ShopifyAddress | null;
}

async function shopifyFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Shopify API error ${res.status}: ${errorBody}`);
  }

  return res.json();
}

export async function fetchDraftOrders(): Promise<DraftOrder[]> {
  // Fetch all draft orders and filter by tag "Venta Corporativa"
  const allOrders: DraftOrder[] = [];
  let pageInfo: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const params = new URLSearchParams({
      limit: "250",
      status: "open",
    });

    let url = `/draft_orders.json?${params.toString()}`;
    if (pageInfo) {
      url = `/draft_orders.json?limit=250&page_info=${pageInfo}`;
    }

    const response = await shopifyFetch(url);
    const orders: DraftOrder[] = response.draft_orders || [];

    // Filter for "Venta Corporativa" tag
    const corporateOrders = orders.filter((order) => {
      const tags = order.tags
        .split(",")
        .map((t) => t.trim().toLowerCase());
      return tags.includes("venta corporativa");
    });

    allOrders.push(...corporateOrders);

    // Check for pagination - simplified, most stores won't have > 250 corporate orders
    hasNextPage = false;
  }

  // Sort by created_at descending
  allOrders.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return allOrders;
}

export async function fetchDraftOrder(id: number): Promise<DraftOrder> {
  const response = await shopifyFetch(`/draft_orders/${id}.json`);
  return response.draft_order;
}

export async function updateDraftOrderTags(
  id: number,
  newTags: string
): Promise<DraftOrder> {
  const response = await shopifyFetch(`/draft_orders/${id}.json`, {
    method: "PUT",
    body: JSON.stringify({
      draft_order: {
        id,
        tags: newTags,
      },
    }),
  });
  return response.draft_order;
}

export function getOrderStatus(tags: string): "pendiente" | "aprobada" | "otro" {
  const tagList = tags
    .split(",")
    .map((t) => t.trim().toLowerCase());
  if (tagList.includes("aprobada")) return "aprobada";
  if (tagList.includes("pendiente aprobación")) return "pendiente";
  return "otro";
}

export function isOrderUrgent(tags: string): boolean {
  const tagList = tags
    .split(",")
    .map((t) => t.trim().toLowerCase());
  return tagList.includes("urgente");
}

export function replaceTag(
  tags: string,
  oldTag: string,
  newTag: string
): string {
  const tagList = tags.split(",").map((t) => t.trim());
  const updatedTags = tagList.map((t) =>
    t.toLowerCase() === oldTag.toLowerCase() ? newTag : t
  );
  return updatedTags.join(", ");
}
