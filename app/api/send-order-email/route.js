import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, total, reference, customerMessage, payment } = body;

    // Log immediately so Vercel captures order details even if email fails
    console.log("NEW ORDER RECEIVED:", JSON.stringify({
      reference,
      customer,
      items,
      total,
      customerMessage,
      timestamp: new Date().toISOString(),
    }));

    // Validate required env vars
    const apiKey = process.env.BREVO_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!apiKey) {
      console.error("BREVO_API_KEY is missing");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    if (!adminEmail) {
      console.error("ADMIN_EMAIL is missing");
      return NextResponse.json({ error: "Admin email not configured" }, { status: 500 });
    }

    // Build items HTML table
    const itemsRows = Array.isArray(items)
      ? items.map((item) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee;">${item.name || "N/A"}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.color || "N/A"}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.size || "N/A"}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.quantity || 1}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">₦${Number(item.subtotal || 0).toLocaleString()}</td>
          </tr>
        `).join("")
      : "<tr><td colspan='5'>No items</td></tr>";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1A1714;background:#fff;padding:24px;border-radius:12px;">
        
        <div style="background:linear-gradient(135deg,#E8A0BF,#C4895A);padding:20px;border-radius:10px;text-align:center;margin-bottom:24px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">New Order — Chic Shoppae 🛍️</h1>
        </div>

        <h3 style="color:#C4895A;border-bottom:2px solid #F5F0E8;padding-bottom:8px;">Customer Details</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:6px 0;color:#666;width:140px;">Name</td>
            <td style="padding:6px 0;font-weight:bold;">${customer?.fullName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#666;">Email</td>
            <td style="padding:6px 0;">${customer?.email || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#666;">Phone</td>
            <td style="padding:6px 0;">${customer?.phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#666;">Address</td>
            <td style="padding:6px 0;">${[customer?.streetAddress, customer?.city, customer?.state, customer?.country].filter(Boolean).join(", ") || "N/A"}</td>
          </tr>
          ${customerMessage ? `
          <tr>
            <td style="padding:6px 0;color:#666;">Note</td>
            <td style="padding:6px 0;font-style:italic;">${customerMessage}</td>
          </tr>` : ""}
        </table>

        <h3 style="color:#C4895A;border-bottom:2px solid #F5F0E8;padding-bottom:8px;">Items Ordered</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#F5F0E8;">
              <th style="padding:10px;text-align:left;font-size:12px;">Item</th>
              <th style="padding:10px;text-align:center;font-size:12px;">Colour</th>
              <th style="padding:10px;text-align:center;font-size:12px;">Size</th>
              <th style="padding:10px;text-align:center;font-size:12px;">Qty</th>
              <th style="padding:10px;text-align:right;font-size:12px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div style="background:#F5F0E8;padding:16px;border-radius:8px;text-align:right;margin-bottom:20px;">
          <span style="font-size:20px;font-weight:bold;color:#1A1714;">
            Total Paid: ₦${Number(total || 0).toLocaleString()}
          </span>
        </div>

        <p style="color:#888;font-size:12px;text-align:center;">
          Payment Reference: <strong>${reference || "N/A"}</strong><br/>
          ✅ Verified via Paystack<br/>
          📦 Delivery fee is paid by the customer directly to the rider on arrival
        </p>

      </div>
    `;

    // Send email via Brevo REST API directly (no SDK needed)
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
      sender: {
  name: "Chic Shoppae Orders",
  email: "oyewoleprecious014@gmail.com",
},
        to: [{ email: adminEmail, name: "Chic Shoppae" }],
        subject: `New Order — ₦${Number(total || 0).toLocaleString()} from ${customer?.fullName || "Customer"}`,
        htmlContent: html,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Brevo error:", result);
      return NextResponse.json(
        { error: result?.message || "Failed to send email" },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", result);
    return NextResponse.json({ success: true, messageId: result?.messageId });

  } catch (err) {
    console.error("Route crash:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown server error" },
      { status: 500 }
    );
  }
}