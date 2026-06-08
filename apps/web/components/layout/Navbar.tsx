import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl font-medium tracking-tight text-primary-900">
          SUNDER.
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/projects" className="hover:text-primary-900 transition-colors">Projects</Link>
          <Link href="/research" className="hover:text-primary-900 transition-colors">Research</Link>
          <Link href="/now" className="hover:text-primary-900 transition-colors">Now</Link>
          <Link href="/timeline" className="hover:text-primary-900 transition-colors">Timeline</Link>
          <Link href="/map" className="hover:text-primary-900 transition-colors">Map</Link>
          <Link href="/photography" className="hover:text-primary-900 transition-colors">Photography</Link>
        </nav>
        {/* Mobile Menu Button placeholder */}
        <button className="md:hidden p-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
