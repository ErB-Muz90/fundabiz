import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/lib/api-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refresh_token } = body;

    const response = await apiClient.post('/auth/refresh', { refresh_token });
    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Token refresh failed';
    return NextResponse.json({ message }, { status });
  }
}
