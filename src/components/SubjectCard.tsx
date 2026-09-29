"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, Code2, Network, Calculator, Cpu, Leaf, Library } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  accentColor: string;
  documentCount: number;
}

const getIcon = (iconName: string, className?: string) => {
  switch (iconName) {
    case "BrainCircuit": return <BrainCircuit className={className} />;
    case "Code2": return <Code2 className={className} />;
    case "Network": return <Network className={className} />;
    case "Calculator": return <Calculator className={className} />;
    case "Cpu": return <Cpu className={className} />;
    case "Leaf": return <Leaf className={className} />;
    default: return <Library className={className} />;
  }
};

export function SubjectCard({ name, slug, description, iconName, accentColor, documentCount }: SubjectCardProps) {
  // Mapping tailwind colors dynamically for the subtle accents
  const bgColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    teal: "bg-teal-50 text-teal-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
  };
  
  const borderColors: Record<string, string> = {
    blue: "group-hover:border-blue-200",
    violet: "group-hover:border-violet-200",
    teal: "group-hover:border-teal-200",
    indigo: "group-hover:border-indigo-200",
    amber: "group-hover:border-amber-200",
    green: "group-hover:border-green-200",
  };

  const iconColor = bgColors[accentColor] || bgColors.blue;
  const hoverBorder = borderColors[accentColor] || borderColors.blue;

  return (
    <Link 
      href={`/subjects/${slug}`}
      className={cn(
        "group block bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden",
        hoverBorder
      )}
    >
      {/* Subtle top accent bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity",
        `bg-${accentColor}-400`
      )} style={{ backgroundColor: accentColor === 'amber' ? '#fbbf24' : accentColor === 'violet' ? '#8b5cf6' : accentColor === 'teal' ? '#14b8a6' : accentColor === 'indigo' ? '#6366f1' : accentColor === 'green' ? '#22c55e' : '#3b82f6' }} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-lg", iconColor)}>
          {getIcon(iconName, "w-5 h-5")}
        </div>
        <div className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
          {documentCount} {documentCount === 1 ? 'doc' : 'docs'}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{name}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{description}</p>
      
      <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
        <span>Open Subject</span>
        <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
    </Link>
  );
}
