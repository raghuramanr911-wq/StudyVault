"use client";

import { FileText, MoreHorizontal, Star, Download, Trash2, Edit2, Image as ImageIcon } from "lucide-react";
import { Document, subjects, categories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function DocumentRow({ document }: { document: Document }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(document.favorite);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const subject = subjects.find(s => s.id === document.subjectId);
  const category = categories.find(c => c.id === document.categoryId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    window.document.addEventListener("mousedown", handleClickOutside);
    return () => window.document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/documents/${document.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete document");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsDeleting(false);
      setShowDropdown(false);
    }
  };

  const isImage = document.fileType?.startsWith('image/') || document.name?.match(/\.(png|jpg|jpeg|gif)$/i);
  const isDocx = document.fileType?.includes('wordprocessingml') || document.name?.endsWith('.docx');
  const Icon = isImage ? ImageIcon : FileText;
  const iconColor = isImage ? "text-blue-500 bg-blue-50" : isDocx ? "text-blue-600 bg-blue-50" : "text-red-500 bg-red-50";

  if (isDeleting) return null; // Optimistic hide

  return (
    <div 
      className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-sm hover:border-gray-200 transition-all duration-200 mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setShowDropdown(false);
        setIsHovered(false);
      }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", iconColor)}>
          <Icon className="w-5 h-5" />
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
          (isHovered || showDropdown) ? "opacity-0" : "opacity-100"
        )}>
          {document.uploadedAt}
        </div>

        {/* Actions - appear on hover */}
        <div className={cn(
          "flex items-center gap-1 transition-opacity",
          (isHovered || showDropdown) ? "opacity-100" : "opacity-0 md:opacity-0"
        )}>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
          >
            <Star className={cn("w-4 h-4", isFavorite && "fill-amber-400 text-amber-400")} />
          </button>
          <a 
            href={document.fileUrl}
            target="_blank"
            download={document.name}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors hidden sm:block"
          >
            <Download className="w-4 h-4" />
          </a>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className={cn("p-1.5 rounded-md transition-colors", showDropdown ? "text-gray-900 bg-gray-100" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100")}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10 py-1">
                <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Open Button always visible on mobile, visible on hover for desktop */}
        <Link 
          href={`/subjects/${subject?.slug}/document/${document.id}`}
          className={cn(
            "ml-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all sm:opacity-0",
            (isHovered || showDropdown) && "sm:opacity-100",
            "bg-gray-50 text-gray-700 hover:bg-violet-50 hover:text-violet-700 border border-gray-200 hover:border-violet-200"
          )}
        >
          Open
        </Link>
      </div>
    </div>
  );
}
