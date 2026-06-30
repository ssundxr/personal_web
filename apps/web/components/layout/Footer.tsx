import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border-subtle transition-colors duration-[1200ms]">
      <div className="w-full px-5 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 flex flex-col md:flex-row justify-between items-start gap-12 sm:gap-16 md:gap-8">
        
        {/* Left Side: Brand & Ethos */}
        <div className="flex flex-col max-w-xl">
          <Link href="/" className="text-3xl sm:text-4xl md:text-[6rem] font-bold tracking-tighter text-foreground mb-6 sm:mb-8 leading-none transition-colors duration-[1200ms]">
            Sunder.
          </Link>
          <p className="font-mono text-base sm:text-lg md:text-xl lg:text-2xl text-secondary leading-relaxed mb-10 sm:mb-16 transition-colors duration-[1200ms]">
            Training models, shipping pipelines, and building the next era of intelligent systems. Code that scales. Aesthetics that hit.
          </p>
          <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-secondary opacity-70 transition-colors duration-[1200ms]">
            © {new Date().getFullYear()} All Rights Reserved
          </span>
        </div>

        {/* Right Side: Navigation Grid */}
        <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 lg:gap-x-24 gap-y-10 sm:gap-y-16 w-full md:w-auto">
          
          <div className="flex flex-col gap-4 sm:gap-6">
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-secondary mb-2 sm:mb-4 border-b border-border-subtle pb-3 sm:pb-4 transition-colors duration-[1200ms]">Index</span>
            <Link href="/" className="font-mono text-base sm:text-lg md:text-xl lg:text-2xl text-foreground hover:text-accent transition-colors duration-500">Home</Link>
            <Link href="/gallery" className="font-mono text-base sm:text-lg md:text-xl lg:text-2xl text-foreground hover:text-accent transition-colors duration-500">Gallery</Link>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-secondary mb-2 sm:mb-4 border-b border-border-subtle pb-3 sm:pb-4 transition-colors duration-[1200ms]">Connect</span>
            <a href="mailto:shyamsundxr@gmail.com" className="font-mono text-base sm:text-lg md:text-xl lg:text-2xl text-foreground hover:text-accent transition-colors duration-500">Email</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="font-mono text-base sm:text-lg md:text-xl lg:text-2xl text-foreground hover:text-accent transition-colors duration-500">Twitter</a>
            <a href="https://linkedin.com/in/sundxrr" target="_blank" rel="noopener noreferrer" className="font-mono text-base sm:text-lg md:text-xl lg:text-2xl text-foreground hover:text-accent transition-colors duration-500">LinkedIn</a>
            <a href="https://github.com/ssundxr" target="_blank" rel="noopener noreferrer" className="font-mono text-base sm:text-lg md:text-xl lg:text-2xl text-foreground hover:text-accent transition-colors duration-500">GitHub</a>
          </div>

        </div>

      </div>
    </footer>
  );
}

