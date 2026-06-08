import Link from "next/link";
import { createStory } from "../actions";

export default function NewStory() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/stories" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Back to Stories
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">New Story</h1>
        </div>
      </div>
      
      <form action={createStory} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
          <input 
            id="title" 
            name="title" 
            type="text" 
            required 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20"
            placeholder="e.g. Building a Personal OS"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="slug" className="text-sm font-medium text-gray-700">Slug</label>
          <input 
            id="slug" 
            name="slug" 
            type="text" 
            required 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20"
            placeholder="e.g. building-personal-os"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="content_mdx" className="text-sm font-medium text-gray-700">Content (MDX)</label>
          <textarea 
            id="content_mdx" 
            name="content_mdx" 
            required 
            rows={15}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 font-mono text-sm"
            placeholder="Write your story here..."
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="is_published" 
            name="is_published" 
            className="w-4 h-4 text-primary-900 rounded border-gray-300 focus:ring-primary-900"
          />
          <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Publish immediately</label>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
            Save Story
          </button>
        </div>
      </form>
    </div>
  );
}
