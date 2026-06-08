import Link from "next/link";
import { uploadMedia } from "../actions";

export default function NewMedia() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/media" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Back to Media Library
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Upload Media</h1>
        </div>
      </div>
      
      <form action={uploadMedia} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6 max-w-xl">
        <div className="flex flex-col gap-2">
          <label htmlFor="file" className="text-sm font-medium text-gray-700">Select Image</label>
          <input 
            id="file" 
            name="file" 
            type="file" 
            accept="image/*"
            required 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20"
          />
          <p className="text-xs text-gray-500">Image will be uploaded to Cloudinary and tracked in the Database.</p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
