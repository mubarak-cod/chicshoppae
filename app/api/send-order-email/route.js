import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, total, reference, customerMessage } = body;

    // Log order immediately — captured in Vercel live logs
    // even if email fails
    console.log("NEW ORDER:", JSON.stringify({
      reference,
      customer,
      items,
      total,
      timestamp: new Date().toISOString(),
    }));

    // Check env vars
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Gmail credentials missing");
      return NextResponse.json(
        { error: "Email not configured" },
        { status: 500 }
      );
    }

    if (!process.env.ADMIN_EMAIL) {
      console.error("ADMIN_EMAIL missing");
      return NextResponse.json(
        { error: "Admin email not configured" },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Build items table
    const itemsRows = Array.isArray(items)
      ? items
          .map(
            (item) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee;">${item.name || "N/A"}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.color || "N/A"}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.size || "N/A"}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.quantity || 1}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">₦${Number(item.subtotal || 0).toLocaleString()}</td>
          </tr>
        `
          )
          .join("")
      : "<tr><td colspan='5'>No items</td></tr>";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1A1714;">
        
        <div style="background:linear-gradient(135deg,#E8A0BF,#C4895A);padding:24px;border-radius:12px;text-align:center;margin-bottom:24px;">
          <h1 style="color:#fff;margin:0;font-size:24px;">New Order 🛍️</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">Chic Shoppae</p>
        </div>

        <h3 style="color:#C4895A;">Customer Details</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#f9f5f0;border-radius:8px;">
          <tr>
            <td style="padding:10px 14px;color:#666;width:130px;font-size:13px;">Name</td>
            <td style="padding:10px 14px;font-weight:bold;">${customer?.fullName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;color:#666;font-size:13px;">Email</td>
            <td style="padding:10px 14px;">${customer?.email || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;color:#666;font-size:13px;">Phone</td>
            <td style="padding:10px 14px;">${customer?.phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;color:#666;font-size:13px;">Address</td>
            <td style="padding:10px 14px;">${[customer?.streetAddress, customer?.city, customer?.state, customer?.country].filter(Boolean).join(", ") || "N/A"}</td>
          </tr>
          ${customerMessage ? `
          <tr>
            <td style="padding:10px 14px;color:#666;font-size:13px;">Note</td>
            <td style="padding:10px 14px;font-style:italic;color:#666;">${customerMessage}</td>
          </tr>` : ""}
        </table>

        <h3 style="color:#C4895A;">Items Ordered</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#F5F0E8;">
              <th style="padding:10px;text-align:left;font-size:12px;color:#666;">Item</th>
              <th style="padding:10px;text-align:center;font-size:12px;color:#666;">Colour</th>
              <th style="padding:10px;text-align:center;font-size:12px;color:#666;">Size</th>
              <th style="padding:10px;text-align:center;font-size:12px;color:#666;">Qty</th>
              <th style="padding:10px;text-align:right;font-size:12px;color:#666;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div style="background:#F5F0E8;padding:16px 20px;border-radius:10px;text-align:right;margin-bottom:20px;">
          <p style="margin:0;font-size:20px;font-weight:bold;color:#1A1714;">
            Total Paid: ₦${Number(total || 0).toLocaleString()}
          </p>
        </div>

        <p style="color:#999;font-size:12px;text-align:center;border-top:1px solid #eee;padding-top:16px;">
          Reference: <strong>${reference || "N/A"}</strong> &nbsp;·&nbsp; ✅ Verified via Paystack<br/>
          📦 Delivery fee is paid by the customer directly to the rider on arrival
        </p>

      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"Chic Shoppae Orders" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order — ₦${Number(total || 0).toLocaleString()} from ${customer?.fullName || "Customer"}`,
      html,
    });

    console.log("Email sent:", info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });

  } catch (err) {
    console.error("Email route error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}