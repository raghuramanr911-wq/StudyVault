"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Home, Library, Star, Clock, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white p-6 md:p-8 lg:p-10 pb-24 md:pb-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-3 px-4 z-50 pb-safe">
        <Link href="/" className={cn("flex flex-col items-center gap-1", pathname === "/" ? "text-violet-600" : "text-gray-500")}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/subjects" className={cn("flex flex-col items-center gap-1", pathname.startsWith("/subjects") ? "text-violet-600" : "text-gray-500")}>
          <Library className="w-5 h-5" />
          <span className="text-[10px] font-medium">Subjects</span>
        </Link>
        
        {/* Floating Action Button for Upload */}
        <Link href="/upload" className="relative -top-5 flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 rounded-full text-white shadow-lg shadow-violet-500/25">
          <span className="text-2xl font-light">+</span>
        </Link>
        
        <Link href="/recent" className={cn("flex flex-col items-center gap-1", pathname === "/recent" ? "text-violet-600" : "text-gray-500")}>
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-medium">Recent</span>
        </Link>
      </div>
    </div>
  );
}
