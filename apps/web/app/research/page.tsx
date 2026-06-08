import Link from "next/link";

export default function Research() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary-900 mb-6">Research</h1>
        <p className="text-xl text-gray-500">
          Academic publications, whitepapers, and independent research on human-computer interaction.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-12 pb-12 border-b border-gray-100 last:border-0">
            <div className="w-48 shrink-0">
              <p className="text-sm font-mono text-gray-500">NeurIPS 2026</p>
              <p className="text-xs text-gray-400 mt-1">December 2026</p>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-medium text-primary-900 mb-3 hover:underline cursor-pointer">
                Title of the Research Publication {i}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                An abstract summarizing the findings of the research paper. We introduce a novel architecture for local LLM inference that reduces memory bandwidth bottlenecks by 40% while preserving zero-shot reasoning capabilities.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">Read PDF ↗</a>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Code Repository ↗</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
