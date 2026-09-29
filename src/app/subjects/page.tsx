import { subjects } from "@/data/mockData";
import { getDocuments } from "@/lib/storage";
import { SubjectCard } from "@/components/SubjectCard";

export const dynamic = 'force-dynamic';

export default async function SubjectsPage() {
  const documents = await getDocuments();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">All Subjects</h1>
        <p className="text-gray-500 mb-8">Browse and manage your study materials by subject.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const count = documents.filter(d => d.subjectId === subject.id).length;
            return <SubjectCard key={subject.id} {...subject} documentCount={count} />;
          })}
        </div>
      </section>
    </div>
  );
}
