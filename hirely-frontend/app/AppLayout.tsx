"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Define routes where navbar should be hidden
  const hideNavbarRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password'
  ];

  const hideFooterRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password'
  ];
  const shouldShowNavbar = !hideNavbarRoutes.some(route => 
    pathname.startsWith(route)
  );
  const shouldShowFooter = !hideFooterRoutes.some(route =>
    pathname.startsWith(route)
  );

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main className={shouldShowNavbar ? "min-h-screen pt-25 px-10" : "min-h-screen"}>
        {children}
      </main>
      {shouldShowFooter && <Footer />}
    </>
  );
}