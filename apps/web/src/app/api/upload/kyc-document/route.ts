import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { file_name, content_type, document_type } = body;

    // Proxy to Go backend for presigned URL
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/upload/presigned-url`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name, content_type, document_type }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Failed to generate upload URL' }, { status: 500 });
  }
}
