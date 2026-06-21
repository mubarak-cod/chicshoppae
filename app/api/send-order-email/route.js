import { NextResponse } from "next/server";
import { Resend } from "resend";

function renderItems(items) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-top:1px solid #e7e0d7;">${item.name}</td>
          <td style="padding:8px 0;border-top:1px solid #e7e0d7;">${item.color || "N/A"}</td>
          <td style="padding:8px 0;border-top:1px solid #e7e0d7;">${item.size || "N/A"}</td>
          <td style="padding:8px 0;border-top:1px solid #e7e0d7;">${item.quantity}</td>
          <td style="padding:8px 0;border-top:1px solid #e7e0d7; text-align:right;">₦${(Number(item.price) * item.quantity).toLocaleString()}</td>
        </tr>
      `
    )
    .join("");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = process.env.RESEND_API_KEY;
    const ownerEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;

    if (!apiKey || !ownerEmail || !fromEmail) {
      return NextResponse.json(
        { error: "Resend API key, FROM_EMAIL, or ADMIN_EMAIL is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const customer = body.customer || {};
    const items = Array.isArray(body.items) ? body.items : [];
    const reference = body.reference || body?.payment?.reference || "N/A";
    const total = Number(body.total || 0).toLocaleString();
    const customerMessage = body.customerMessage || customer.customerMessage || "";
    const address = [customer.streetAddress, customer.city, customer.state, customer.country]
      .filter(Boolean)
      .join(", ");

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1A1714; line-height: 1.6;">
        <h2 style="margin:0 0 12px;">New paid order</h2>
        <p style="margin:0 0 6px;"><strong>Customer:</strong> ${customer.fullName || "N/A"}</p>
        <p style="margin:0 0 6px;"><strong>Email:</strong> ${customer.email || "N/A"}</p>
        <p style="margin:0 0 6px;"><strong>Phone:</strong> ${customer.phone || "N/A"}</p>
        <p style="margin:0 0 6px;"><strong>Address:</strong> ${address || "N/A"}</p>
        <p style="margin:0 0 6px;"><strong>Paystack reference:</strong> ${reference}</p>
        ${customerMessage ? `<p style="margin:0 0 6px;"><strong>Customer message:</strong> ${customerMessage}</p>` : ""}
        <table style="width:100%; border-collapse:collapse; margin-top:16px;">
          <thead>
            <tr>
              <th align="left" style="padding:8px 0; border-bottom:1px solid #d8cfc4;">Item</th>
              <th align="left" style="padding:8px 0; border-bottom:1px solid #d8cfc4;">Shade</th>
              <th align="left" style="padding:8px 0; border-bottom:1px solid #d8cfc4;">Size</th>
              <th align="left" style="padding:8px 0; border-bottom:1px solid #d8cfc4;">Qty</th>
              <th align="right" style="padding:8px 0; border-bottom:1px solid #d8cfc4;">Line total</th>
            </tr>
          </thead>
          <tbody>${renderItems(items)}</tbody>
        </table>
        <p style="margin:16px 0 0;"><strong>Total:</strong> ₦${total}</p>
      </div>
    `;

    const text = [
      `New paid order`,
      `Customer: ${customer.fullName || "N/A"}`,
      `Email: ${customer.email || "N/A"}`,
      `Phone: ${customer.phone || "N/A"}`,
      `Address: ${address || "N/A"}`,
      `Reference: ${reference}`,
      customerMessage ? `Message: ${customerMessage}` : null,
      `Total: ₦${total}`,
      ...items.map((item) => `${item.name} - ${item.color || "N/A"} - ${item.size || "N/A"} - ${item.quantity}`),
    ].join("\n");

    const result = await resend.emails.send({
      from: `Chic Shoppae <${fromEmail}>`,
      to: [ownerEmail],
      subject: `New paid order - ${reference}`,
      text,
      html,
    });

    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order email could not be sent." },
      { status: 500 }
    );
  }
}