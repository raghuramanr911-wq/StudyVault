"use client";

import dynamic from 'next/dynamic';

const PdfViewerClient = dynamic(
  () => import('./PdfViewerClient').then(mod => mod.PdfViewerClient),
  { 
    ssr: false,
    loading: () => <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading PDF Viewer...</div>
  }
);

export function PdfViewerWrapper({ document, subject }: { document: any, subject: any }) {
  return <PdfViewerClient document={document} subject={subject} />;
}
