"use client";

import { FileText, MoreHorizontal, Star, Download, Trash2, Edit2 } from "lucide-react";
import { Document, subjects, categories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export function DocumentRow({ document }: { document: Document }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(document.favorite);

  const subject = subjects.find(s => s.id === document.subjectId);
  const category = categories.find(c => c.id === document.categoryId);

  return (
    <div 
      className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-sm hover:border-gray-200 transition-all duration-200 mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <Link href={`/subjects/${subject?.slug}/document/${document.id}`} className="block">
            <h4 className="font-medium text-gray-900 truncate hover:text-violet-600 transition-colors">
              {document.name}
            </h4>
          </Link>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
            <span className="truncate">{subject?.name}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{category?.name}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{document.fileSize}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        {/* Date visible only on larger screens or when not hovering */}
        <div className={cn(
          "text-xs text-gray-400 hidden md:block transition-opacity",
          isHovered ? "opacity-0" : "opacity-100"
        )}>
          {document.uploadedAt}
        </div>

        {/* Actions - appear on hover */}
        <div className={cn(
          "flex items-center gap-1 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0 md:opacity-0"
        )}>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
          >
            <Star className={cn("w-4 h-4", isFavorite && "fill-amber-400 text-amber-400")} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors hidden sm:block">
            <Download className="w-4 h-4" />
          </button>
          <div className="relative">
            <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Open Button always visible on mobile, visible on hover for desktop */}
        <Link 
          href={`/subjects/${subject?.slug}/document/${document.id}`}
          className={cn(
            "ml-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all sm:opacity-0 group-hover:opacity-100",
            "bg-gray-50 text-gray-700 hover:bg-violet-50 hover:text-violet-700 border border-gray-200 hover:border-violet-200"
          )}
        >
          Open
        </Link>
      </div>
    </div>
  );
}
