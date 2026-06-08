export default function ResearchManager() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Research</h1>
        <button className="px-4 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
          Add Publication
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Venue</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Placeholder row */}
            <tr>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">Cognitive Load in Spatial Interfaces</div>
                <div className="text-sm text-gray-500">/research/cognitive-load</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">CHI 2026</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Dec 2026
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
