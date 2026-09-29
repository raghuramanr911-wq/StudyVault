import { NextRequest, NextResponse } from 'next/server';
import { saveDocument } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const subjectId = formData.get('subjectId') as string;
    const categoryId = formData.get('categoryId') as string;
    const unit = formData.get('unit') as string;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!subjectId) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${subjectId}/${fileName}`;
    
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    const newDocument = {
      id: `doc-${uuidv4()}`,
      name: name || file.name,
      subjectId,
      categoryId: categoryId || 'cat-7', // Default to Other
      fileUrl,
      fileType: file.type || 'application/pdf',
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      updatedAt: new Date().toISOString(),
      unit: unit || '',
      topic: '',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      description: '',
      favorite: false,
      lastOpenedAt: null,
      storagePath: filePath // Keep track of the storage path for deletion
    };

    await saveDocument(newDocument as any);

    return NextResponse.json({ success: true, document: newDocument });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
