import Link from "next/link";

const links = [
  { name: "Archive", path: "/journal/projects" },
  { name: "Research", path: "/journal/research" },
  { name: "Timeline", path: "/journal/timeline" },
  { name: "Map", path: "/journal/map" },
  { name: "Photography", path: "/journal/photography" },
  { name: "Current Chapter", path: "/journal/now" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f0efed]/70 backdrop-blur-xl border-b border-[#d1d5db]/50 transition-all duration-300">
      <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xl md:text-2xl font-bold tracking-tight text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors"
        >
          Sunder.
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-mono text-sm md:text-base text-[#666]">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="hover:text-[#1a1a1a] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-[#1a1a1a]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
