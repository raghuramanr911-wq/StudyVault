"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { subjects, categories } from "@/data/mockData";
import { UploadCloud, File, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function UploadForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectIdFromUrl = searchParams.get("subject");
  
  const [selectedSubject, setSelectedSubject] = useState(subjectIdFromUrl || "");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    if (subjectIdFromUrl) {
      setSelectedSubject(subjectIdFromUrl);
    }
  }, [subjectIdFromUrl]);

  const activeSubject = subjects.find(s => s.id === selectedSubject);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file || !selectedSubject) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name.replace(/\.[^/.]+$/, ""));
      formData.append('subjectId', selectedSubject);
      formData.append('categoryId', 'cat-1'); // Defaulting to Notes for now, could be dynamic
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      router.refresh();
      setUploadComplete(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadComplete) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Successful</h2>
        <p className="text-gray-500 mb-8">
          <span className="font-medium text-gray-700">{file?.name}</span> has been added to {activeSubject?.name}.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              setFile(null);
              setUploadComplete(false);
            }}
            className="w-full py-2.5 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Upload Another
          </button>
          <Link 
            href={`/subjects/${activeSubject?.slug}`}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            View Subject
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          {activeSubject ? `Upload to ${activeSubject.name}` : "Upload Document"}
        </h1>
        <p className="text-gray-500 mt-2">Add notes, question papers, assignments or other study materials.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        {!activeSubject && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-gray-900"
            >
              <option value="">Select a subject...</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Dropzone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-10 text-center transition-all",
            !selectedSubject ? "opacity-50 pointer-events-none" : "",
            isDragging ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300 bg-gray-50",
            file ? "bg-white border-solid border-gray-200" : ""
          )}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4 relative">
                <File className="w-8 h-8" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <h3 className="font-medium text-gray-900 truncate max-w-full px-4">{file.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900">Drag & drop your files here</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">or browse from your device. PDF preferred.</p>
              
              <label className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                Browse Files
                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileChange} />
              </label>
            </div>
          )}
        </div>

        {/* Metadata Form */}
        {file && (
          <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Name</label>
              <input type="text" defaultValue={file.name.replace(/\.[^/.]+$/, "")} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-gray-900 text-sm" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-gray-900 text-sm">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit / Topic (Optional)</label>
                <input type="text" placeholder="e.g. Unit 2" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-gray-900 text-sm" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (Comma separated)</label>
              <input type="text" placeholder="important, exam, revision" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-gray-900 text-sm" />
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex flex-col items-end gap-3">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg w-full text-left">
                  {error}
                </div>
              )}
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className={cn(
                  "px-8 py-2.5 rounded-full text-white font-medium shadow-sm transition-all bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500",
                  isUploading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:shadow-md"
                )}
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading upload interface...</div>}>
      <UploadForm />
    </Suspense>
  );
}
