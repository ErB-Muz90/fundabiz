import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/lib/api-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const response = await apiClient.post('/auth/login', { email, password });
    const data = response.data;

    return NextResponse.json(data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Authentication failed';
    return NextResponse.json({ message }, { status });
  }
}
