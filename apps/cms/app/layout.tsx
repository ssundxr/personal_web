import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sunder OS | Admin Dashboard",
  description: "Internal content management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-50 text-foreground antialiased min-h-screen flex`}>
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-10">
          <div className="h-20 flex items-center px-6 border-b border-gray-100">
            <span className="font-semibold text-lg tracking-tight text-primary-900">SUNDER OS</span>
          </div>
          <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
            <Link href="/" className="px-3 py-2 text-sm font-medium rounded-lg text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors">
              Dashboard
            </Link>
            <Link href="/stories" className="px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Stories
            </Link>
            <Link href="/media" className="px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Media Library
            </Link>
            <Link href="/projects" className="px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Projects
            </Link>
            <Link href="/research" className="px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Research
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-100">
            <button className="w-full px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 text-left transition-colors">
              Sign out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
