import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#f0efed] border-t border-[#d1d5db]">
      <div className="w-full px-6 md:px-12 py-20 flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
        
        {/* Left Side: Brand & Ethos */}
        <div className="flex flex-col max-w-xl">
          <Link href="/" className="text-6xl md:text-[6rem] font-bold tracking-tighter text-[#1a1a1a] mb-8 leading-none">
            Sunder.
          </Link>
          <p className="font-mono text-xl md:text-2xl text-[#666] leading-relaxed mb-16">
            The measure of a life is its journey. Designing and building the future of human-computer interaction, spatial computing, and digital legacy.
          </p>
          <span className="font-mono text-sm uppercase tracking-widest text-[#999]">
            © {new Date().getFullYear()} All Rights Reserved
          </span>
        </div>

        {/* Right Side: Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-16 w-full md:w-auto">
          
          <div className="flex flex-col gap-6">
            <span className="font-mono text-sm uppercase tracking-widest text-[#999] mb-4 border-b border-[#d1d5db] pb-4">Index</span>
            <Link href="/" className="font-mono text-xl md:text-2xl text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors">Home</Link>
          </div>

          <div className="flex flex-col gap-6">
            <span className="font-mono text-sm uppercase tracking-widest text-[#999] mb-4 border-b border-[#d1d5db] pb-4">Connect</span>
            <a href="mailto:hello@sunder.dev" className="font-mono text-xl md:text-2xl text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors">Email</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xl md:text-2xl text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xl md:text-2xl text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors">LinkedIn</a>
            <a href="https://github.com/ssundxr" target="_blank" rel="noopener noreferrer" className="font-mono text-xl md:text-2xl text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors">GitHub</a>
          </div>

        </div>

      </div>
    </footer>
  );
}
