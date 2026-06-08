export default function MediaLibrary() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Media Library</h1>
        <button className="px-4 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
          Upload Image
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group aspect-square bg-gray-100 rounded-xl overflow-hidden relative cursor-pointer border border-gray-200">
            <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs truncate drop-shadow-md">IMG_{4000 + i}.jpg</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
