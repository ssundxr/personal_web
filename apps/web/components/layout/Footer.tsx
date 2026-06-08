import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Sunder. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <a href="https://github.com/ssundxr" target="_blank" rel="noopener noreferrer" className="hover:text-primary-900 transition-colors">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-900 transition-colors">
            LinkedIn
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-900 transition-colors">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
