import { subjects } from "@/data/mockData";
import { getDocuments } from "@/lib/storage";
import { SubjectCard } from "@/components/SubjectCard";
import { DocumentRow } from "@/components/DocumentRow";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const documents = await getDocuments();
  const recentDocs = documents.slice(-3).reverse();
  const continueDocs = documents.filter(d => d.progress).slice(0, 2);

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Good to see you.</h1>
        <p className="text-gray-500 mt-1">Your study materials, organized in one place.</p>
      </section>

      {/* Subjects Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Subjects</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const count = documents.filter(d => d.subjectId === subject.id).length;
            return <SubjectCard key={subject.id} {...subject} documentCount={count} />;
          })}
        </div>
      </section>

      {/* Continue Studying */}
      {continueDocs.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Continue Studying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {continueDocs.map((doc) => {
              const subject = subjects.find(s => s.id === doc.subjectId);
              return (
                <div key={doc.id} className="flex flex-col p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-200 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{doc.name.replace(".pdf", "")}</h4>
                    <span className="text-xs text-gray-400">{doc.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-violet-500 h-1.5 rounded-full" 
                      style={{ width: `${doc.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{subject?.name}</span>
                    <span className="text-xs text-gray-500">Page {Math.round((doc.progress || 0) / 100 * (doc.pages || 10))} of {doc.pages}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recently Added */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recently Added</h2>
        </div>
        <div className="space-y-2">
          {recentDocs.map((doc) => (
            <DocumentRow key={doc.id} document={doc} />
          ))}
        </div>
      </section>
    </div>
  );
}
