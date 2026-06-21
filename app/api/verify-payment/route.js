import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { reference, amount } = await request.json();

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Paystack secret key is not configured." }, { status: 500 });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        Accept: "application/json",
      },
    });

    const payload = await response.json();

    if (!response.ok || payload?.status === false) {
      return NextResponse.json(
        { error: payload?.message || "Unable to verify payment with Paystack." },
        { status: 400 }
      );
    }

    const payment = payload?.data || {};
    const expectedAmount = Number(amount) * 100;

    if (expectedAmount && Number(payment?.amount) !== expectedAmount) {
      return NextResponse.json(
        { error: "Verified amount does not match the order total." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, payment }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment verification failed." },
      { status: 500 }
    );
  }
}