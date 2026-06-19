import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border-subtle transition-colors duration-[1200ms]">
      <div className="w-full px-6 md:px-12 py-20 flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
        
        {/* Left Side: Brand & Ethos */}
        <div className="flex flex-col max-w-xl">
          <Link href="/" className="text-6xl md:text-[6rem] font-bold tracking-tighter text-foreground mb-8 leading-none transition-colors duration-[1200ms]">
            Sunder.
          </Link>
          <p className="font-mono text-xl md:text-2xl text-secondary leading-relaxed mb-16 transition-colors duration-[1200ms]">
            The measure of a life is its journey. Designing and building the future of human-computer interaction, spatial computing, and digital legacy.
          </p>
          <span className="font-mono text-sm uppercase tracking-widest text-secondary opacity-70 transition-colors duration-[1200ms]">
            © {new Date().getFullYear()} All Rights Reserved
          </span>
        </div>

        {/* Right Side: Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-16 w-full md:w-auto">
          
          <div className="flex flex-col gap-6">
            <span className="font-mono text-sm uppercase tracking-widest text-secondary mb-4 border-b border-border-subtle pb-4 transition-colors duration-[1200ms]">Index</span>
            <Link href="/" className="font-mono text-xl md:text-2xl text-foreground hover:text-accent transition-colors duration-500">Home</Link>
          </div>

          <div className="flex flex-col gap-6">
            <span className="font-mono text-sm uppercase tracking-widest text-secondary mb-4 border-b border-border-subtle pb-4 transition-colors duration-[1200ms]">Connect</span>
            <a href="mailto:shyamsundxr@gmail.com" className="font-mono text-xl md:text-2xl text-foreground hover:text-accent transition-colors duration-500">Email</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xl md:text-2xl text-foreground hover:text-accent transition-colors duration-500">Twitter</a>
            <a href="https://linkedin.com/in/sundxrr" target="_blank" rel="noopener noreferrer" className="font-mono text-xl md:text-2xl text-foreground hover:text-accent transition-colors duration-500">LinkedIn</a>
            <a href="https://github.com/ssundxr" target="_blank" rel="noopener noreferrer" className="font-mono text-xl md:text-2xl text-foreground hover:text-accent transition-colors duration-500">GitHub</a>
          </div>

        </div>

      </div>
    </footer>
  );
}
