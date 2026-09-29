import { getDocuments } from "@/lib/storage";
import { DocumentRow } from "@/components/DocumentRow";
import { Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function RecentPage() {
  const documents = await getDocuments();
  const recent = documents.filter(d => d.lastOpenedAt).sort((a, b) => 1);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">Recently Viewed</h1>
        <p className="text-gray-500 mb-8">Pick up where you left off.</p>
        
        {recent.length > 0 ? (
          <div className="space-y-2">
            {recent.map((doc) => (
              <DocumentRow key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Documents you open will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
