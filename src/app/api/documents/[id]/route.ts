import { NextRequest, NextResponse } from 'next/server';
import { deleteDocument, getDocument } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const document = await getDocument(resolvedParams.id);
    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete from Supabase Storage
    if (document.storagePath) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.storagePath]);
        
      if (storageError) {
        console.error("Storage delete error:", storageError);
      }
    }

    await deleteDocument(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete API error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
