import { subjects } from "@/data/mockData";
import { getDocuments } from "@/lib/storage";
import { notFound } from "next/navigation";
import { PdfViewerWrapper } from "@/components/PdfViewerWrapper";

export const dynamic = 'force-dynamic';

export default async function DocumentViewerPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const resolvedParams = await params;
  const allDocs = await getDocuments();
  const document = allDocs.find(d => d.id === resolvedParams.id);
  const subject = subjects.find(s => s.slug === resolvedParams.slug);

  if (!document || !subject) {
    notFound();
  }

  return <PdfViewerWrapper document={document} subject={subject} />;
}
