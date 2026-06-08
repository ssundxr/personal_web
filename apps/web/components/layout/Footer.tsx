import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#d1d5db] bg-[#f0efed] py-20 mt-0">
      <div className="max-w-6xl mx-auto px-6">
        {/* Large brand */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1a1a1a] uppercase">
            Sunder
          </h2>
          <p className="font-mono text-xs text-[#999] mt-4">
            the measure of a life is its journey.
          </p>
        </div>

        {/* Link columns */}
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-6 font-mono text-xs text-[#666] mb-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">home</Link>
            <Link href="/now" className="hover:text-[#1a1a1a] transition-colors">now</Link>
            <Link href="/map" className="hover:text-[#1a1a1a] transition-colors">map</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/projects" className="hover:text-[#1a1a1a] transition-colors">projects</Link>
            <Link href="/research" className="hover:text-[#1a1a1a] transition-colors">research</Link>
            <Link href="/photography" className="hover:text-[#1a1a1a] transition-colors">photography</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/timeline" className="hover:text-[#1a1a1a] transition-colors">timeline</Link>
            <a href="https://github.com/ssundxr" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a1a] transition-colors">github</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a1a] transition-colors">linkedin</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#d1d5db] pt-6 flex justify-center">
          <span className="font-mono text-[10px] text-[#bbb]">
            sunder.{new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
