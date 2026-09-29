"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { subjects } from "@/data/mockData";
import { 
  LayoutDashboard, 
  Library, 
  Star, 
  Clock, 
  Files, 
  Upload, 
  Settings,
  BrainCircuit,
  Code2,
  Network,
  Calculator,
  Cpu,
  Leaf
} from "lucide-react";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "BrainCircuit": return <BrainCircuit className="w-4 h-4" />;
    case "Code2": return <Code2 className="w-4 h-4" />;
    case "Network": return <Network className="w-4 h-4" />;
    case "Calculator": return <Calculator className="w-4 h-4" />;
    case "Cpu": return <Cpu className="w-4 h-4" />;
    case "Leaf": return <Leaf className="w-4 h-4" />;
    default: return <Library className="w-4 h-4" />;
  }
};

const navItems = [
  { name: "Dashboard", href: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: "Subjects", href: "/subjects", icon: <Library className="w-4 h-4" /> },
  { name: "Recently Viewed", href: "/recent", icon: <Clock className="w-4 h-4" /> },
  { name: "All Documents", href: "/documents", icon: <Files className="w-4 h-4" /> },
  { name: "Upload", href: "/upload", icon: <Upload className="w-4 h-4" /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#F9FAFB] border-r border-gray-200 h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
            <Library className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-gray-900 group-hover:opacity-80 transition-opacity">
            StudyVault
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-8">
        <div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <span className={cn(
                    "flex items-center justify-center",
                    isActive ? "text-violet-600" : "text-gray-400"
                  )}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Subjects
          </h3>
          <nav className="space-y-1">
            {subjects.map((subject) => {
              const href = `/subjects/${subject.slug}`;
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={subject.id}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
                    isActive
                      ? "bg-white text-gray-900 shadow-sm border border-gray-100 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <span className={cn(
                    "flex items-center justify-center",
                    isActive ? `text-${subject.accentColor}-600` : "text-gray-400"
                  )}>
                    {getIcon(subject.iconName)}
                  </span>
                  <span className="truncate">{subject.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
