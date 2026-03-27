import { Resend } from "resend";
import { DraftOrder } from "./shopify";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = "notificaciones@notificaciones.generandoideas.com";
const TO_EMAIL = [
  "nsanchez@generandoideas.com",
  "igarcia@generandoideas.com",
  "guadalupe.sedeno@suramexico.com"
];

export async function sendApprovalEmail(order: DraftOrder) {
  const customerName = order.customer
    ? `${order.customer.first_name} ${order.customer.last_name}`
    : "Sin cliente asignado";

  const companyName = order.customer?.company || order.shipping_address?.company || "";

  const lineItemsHtml = order.line_items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 16px; border-bottom: 1px solid #eee; font-size: 14px; color: #333;">${item.title}${item.variant_title ? ` — ${item.variant_title}` : ""}</td>
        <td style="padding: 10px 16px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 16px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; text-align: right;">$${parseFloat(item.price).toFixed(2)} ${order.currency}</td>
      </tr>
    `
    )
    .join("");

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
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
            ${companyName
        ? `<tr>
              <td style="padding: 4px 0; font-size: 14px; color: #64748b;">Empresa:</td>
              <td style="padding: 4px 0; font-size: 14px; color: #1e293b; font-weight: 500;">${companyName}</td>
            </tr>`
        : ""
      }
            ${order.customer?.email
        ? `<tr>
              <td style="padding: 4px 0; font-size: 14px; color: #64748b;">Email:</td>
              <td style="padding: 4px 0; font-size: 14px; color: #1e293b; font-weight: 500;">${order.customer.email}</td>
            </tr>`
        : ""
      }
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
    `,
  });

  if (error) {
    console.error("Error sending approval email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
