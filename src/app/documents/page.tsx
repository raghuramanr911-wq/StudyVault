import { getDocuments } from "@/lib/storage";
import { DocumentRow } from "@/components/DocumentRow";
import { Search, Filter } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  const documents = await getDocuments();
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">All Documents</h1>
        <p className="text-gray-500 mb-8">Search and filter across your entire study library.</p>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search all documents..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-gray-900"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        <div className="space-y-2">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} document={doc} />
          ))}
        </div>
      </section>
    </div>
  );
}
