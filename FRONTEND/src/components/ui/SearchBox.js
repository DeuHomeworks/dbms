function SearchBox() {
  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center rounded-lg ">
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full px-4 py-2   focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors border-none"
        />
        <button className="px-6 py-3 m-2 bg-white-100 text-gray-400 transition-colors border-none shadow-none rounded-lg hover:bg-gray-200 hover:text-white">
          🔍
        </button>
      </div>
    </div>
  );
}

export default SearchBox;
