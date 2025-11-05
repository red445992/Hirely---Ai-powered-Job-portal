import React from "react";
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";




// constants/navigation.ts
export const NAVIGATION_ITEMS = {
  industryInsights: {
    href: "/dashboard",
    label: "Industry Insights",
    icon: LayoutDashboard,
    mobile: {
      iconOnly: true,
      size: "w-10 h-10 p-0"
    }
  }
} as const;

export const GROWTH_TOOLS_ITEMS = [
  {
    href: "/resume",
    label: "Build Resume",
    icon: FileText,
  },
  {
    href: "/ai-cover-letter",
    label: "Cover Letter",
    icon: PenBox,
  },
  {
    href: "/interview",
    label: "Interview Prep",
    icon: GraduationCap,
  },
] as const;



const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SensAI Dashboard</h1>
            <p className="text-gray-600 mt-2">Access your AI-powered career tools and industry insights</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Industry Insights Button */}
            <Link href="/dashboard/candidate/pricing">
              <Button
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Industry Insights
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarsIcon className="h-4 w-4" />
                  <span>Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Career Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default page;
