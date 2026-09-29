"use client";

import { Search, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { subjects } from "@/data/mockData";

export function Header() {
  const pathname = usePathname();
  
  let pageTitle = "Dashboard";
  if (pathname.startsWith("/subjects/")) {
    const slug = pathname.split("/")[2];
    const subject = subjects.find(s => s.slug === slug);
    if (subject) pageTitle = subject.name;
    else if (pathname === "/subjects") pageTitle = "All Subjects";
  } else if (pathname === "/favorites") pageTitle = "Favorites";
  else if (pathname === "/recent") pageTitle = "Recently Viewed";
  else if (pathname === "/documents") pageTitle = "All Documents";
  else if (pathname === "/upload") pageTitle = "Upload Document";
  else if (pathname === "/settings") pageTitle = "Settings";

  return (
    <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your study library..." 
            className="pl-9 pr-4 py-2 w-64 lg:w-80 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-gray-400 text-gray-900"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-violet-100 border border-gray-200 flex items-center justify-center text-sm font-medium text-violet-700 cursor-pointer">
            US
          </div>
        </div>
      </div>
    </header>
  );
}
