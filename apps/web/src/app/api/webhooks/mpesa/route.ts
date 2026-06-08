import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Proxy M-Pesa callback to Go backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/webhooks/mpesa`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}
