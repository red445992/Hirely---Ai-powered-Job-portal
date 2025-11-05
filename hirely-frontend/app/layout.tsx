
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AppLayout from "./AppLayout";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hirely - Job Portal",
  description:
    "AI-powered job application platform with intelligent resume matching",
  keywords: ["jobs", "recruitment", "career", "hiring", "AI matching"],
  authors: [{ name: "Hirely Team" }],
};

// Move viewport to its own export per Next.js app router requirements
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* AppLayout handles conditional navbar rendering */}

         <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            
        <AppLayout>
          <main role="main" aria-label="Main content">
            {children}
          </main>
        </AppLayout>
          </ThemeProvider>
        
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: "1.125rem",
              fontWeight: 600,
              padding: "1.25rem 2rem",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              color: "#fff",
              border: "none",
            },
          }}
        />
      </body>
    </html>
  );
}