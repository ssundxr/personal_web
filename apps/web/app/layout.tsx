import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CommandPalette } from "../components/CommandPalette";
import { ThemeProvider } from "../components/ThemeProvider";
import { SmoothScroller } from "../components/layout/SmoothScroller";
import { CustomCursor } from "../components/ui/CustomCursor";


const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const oswald = Oswald({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Sunder — Builder, Researcher, Explorer",
  description: "A luxury interactive autobiography where travel, AI projects, photography, reflections, personal growth, and current affairs are woven together into a living digital archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${cormorant.variable} ${jetbrainsMono.variable} ${oswald.variable} font-sans bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex flex-col transition-colors duration-[1200ms]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="portfolio-theme-v2"
        >
          <SmoothScroller>
            <CustomCursor />
            {/* Ambient background container managed via global css matching the theme */}
            <div className="fixed inset-0 pointer-events-none -z-10 dark:ambient-dark ambient-light" />
            
            <CommandPalette />
            <Navbar />
            <main className="flex-1 pt-24 z-0">
              {children}
            </main>
            <Footer />
          </SmoothScroller>
        </ThemeProvider>
      </body>
    </html>
  );
}
