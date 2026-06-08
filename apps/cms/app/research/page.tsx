import Link from "next/link";
import { createClient } from "../../utils/supabase/server";

export default async function ResearchManager() {
  const supabase = await createClient();
  const { data: research, error } = await supabase
    .from("research")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching research:", error);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Research & Papers</h1>
        <Link
          href="/research/new"
          className="px-4 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors"
        >
          Add Paper
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {research?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No research papers found. Add one!
                </td>
              </tr>
            ) : null}
            {research?.map((paper) => (
              <tr key={paper.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{paper.title}</div>
                  <div className="text-sm text-gray-500">/research/{paper.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      paper.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {paper.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(paper.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/research/${paper.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
