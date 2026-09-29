"use client";

import dynamic from 'next/dynamic';
import { Download, ArrowLeft, Image as ImageIcon, FileText } from 'lucide-react';
import Link from 'next/link';

const PdfViewerClient = dynamic(
  () => import('./PdfViewerClient').then(mod => mod.PdfViewerClient),
  { 
    ssr: false,
    loading: () => <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading Viewer...</div>
  }
);

export function PdfViewerWrapper({ document, subject }: { document: any, subject: any }) {
  const isImage = document.fileType?.startsWith('image/') || document.name?.match(/\.(png|jpg|jpeg|gif|webp)$/i);
  const isPdf = document.fileType === 'application/pdf' || document.name?.match(/\.pdf$/i);

  if (isImage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-4">
            <Link href={`/subjects/${subject.slug}`} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-gray-900 text-sm sm:text-base">{document.name}</h1>
            </div>
          </div>
          <a href={document.fileUrl} download={document.name} target="_blank" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Download className="w-5 h-5" />
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <img src={document.fileUrl} alt={document.name} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
        </div>
      </div>
    );
  }

  if (!isPdf) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-4">
            <Link href={`/subjects/${subject.slug}`} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-gray-900 text-sm sm:text-base">{document.name}</h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <FileText className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Preview not available</h2>
          <p className="text-gray-500 max-w-md mb-8">This file type cannot be previewed directly in the browser. Please download it to view the contents.</p>
          <a 
            href={document.fileUrl} 
            download={document.name} 
            target="_blank"
            className="px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download File
          </a>
        </div>
      </div>
    );
  }

  return <PdfViewerClient document={document} subject={subject} />;
}
