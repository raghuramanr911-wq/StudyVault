import { subjects, categories } from "@/data/mockData";
import { getDocuments } from "@/lib/storage";
import { DocumentRow } from "@/components/DocumentRow";
import { Folder, Upload, Search, Filter } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const subject = subjects.find(s => s.slug === resolvedParams.slug);
  
  if (!subject) {
    notFound();
  }

  const allDocuments = await getDocuments();
  const subjectDocs = allDocuments.filter(d => d.subjectId === subject.id);
  const subjectCategories = categories.map(cat => ({
    ...cat,
    documentCount: subjectDocs.filter(d => d.categoryId === cat.id).length
  })).filter(c => c.documentCount > 0 || c.id === 'cat-1' || c.id === 'cat-2' || c.id === 'cat-5');

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Upload */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md bg-gray-50",
              `text-${subject.accentColor}-600`
            )}>
              {subjectDocs.length} Documents
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{subject.name}</h1>
          <p className="text-gray-500 mt-2">{subject.description}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder={`Search within ${subject.name}...`} 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-gray-900"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {subjectCategories.map((category) => (
            <div key={category.id} className="group cursor-pointer p-4 bg-white border border-gray-100 rounded-lg hover:border-violet-200 hover:shadow-sm transition-all">
              <h4 className="font-medium text-sm text-gray-900 truncate">{category.name}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{category.documentCount} {category.documentCount === 1 ? 'doc' : 'docs'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Document List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">All Documents</h2>
        </div>
        
        {subjectDocs.length > 0 ? (
          <div className="space-y-2">
            {subjectDocs.map((doc) => (
              <DocumentRow key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Folder className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">No documents yet</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Your {subject.name} library is empty.</p>
            <Link 
              href={`/upload?subject=${subject.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload First Document
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
