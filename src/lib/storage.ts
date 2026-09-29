import { supabase } from './supabase';
import { Document } from '@/data/mockData';

export async function getDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('uploadedAt', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  return data as Document[];
}

export async function getDocument(id: string): Promise<Document | undefined> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return data as Document;
}

export async function saveDocument(doc: Document): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .insert([doc]);

  if (error) {
    console.error('Error saving document:', error);
    throw error;
  }
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}
