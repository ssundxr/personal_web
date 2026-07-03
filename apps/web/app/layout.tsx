import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CommandPalette } from "../components/CommandPalette";
import { ThemeProvider } from "../components/ThemeProvider";
import { SmoothScroller } from "../components/layout/SmoothScroller";
import { CR7Modal } from "../components/ui/CR7Modal";


const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
};

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
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex flex-col transition-colors duration-[1200ms]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="portfolio-theme-v3"
        >
          <SmoothScroller>
            {/* Ambient background container managed via global css matching the theme */}
            <div className="fixed inset-0 pointer-events-none -z-10 dark:ambient-dark ambient-light" />
            
            <CommandPalette />
            <CR7Modal />
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
