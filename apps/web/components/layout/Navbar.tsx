import Link from "next/link";

const links = [
  { name: "projects", path: "/projects" },
  { name: "research", path: "/research" },
  { name: "now", path: "/now" },
  { name: "timeline", path: "/timeline" },
  { name: "map", path: "/map" },
  { name: "photography", path: "/photography" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f0efed] border-b border-[#d1d5db]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors"
        >
          Sunder
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-[#666]">
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
