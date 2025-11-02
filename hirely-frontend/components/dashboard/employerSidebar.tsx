"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban,BadgePlus,UserCheck  } from 'lucide-react';
export default function EmployerSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard/employer",
      label: "Manage Jobs",
    icon: <FolderKanban className="w-5 h-5" />
    },
    {
      href: "/dashboard/employer/add-job", 
      label: "Add Job",
        icon: <BadgePlus className="w-5 h-5" />
    },
    {
      href: "/dashboard/employer/applications",
      label: "View Applications", 
        icon: <UserCheck className="w-5 h-5" />
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard/employer") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-neutral-200 p-4">

      {/* Main Navigation - Simple List */}
      <div className="space-y-1">
        
        {menuItems.map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                active
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center justify-center ${active ? 'text-blue-700' : 'text-neutral-500'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Separator */}
      <div className="my-8 border-t border-neutral-200"></div>

      
    </div>
  );
}