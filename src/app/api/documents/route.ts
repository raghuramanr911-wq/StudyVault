import { NextResponse } from 'next/server';
import { getDocuments } from '@/lib/storage';

export async function GET() {
  try {
    const documents = await getDocuments();
    return NextResponse.json({ documents });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
