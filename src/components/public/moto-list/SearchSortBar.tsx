"use client";

interface SearchSortBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
  filteredCount: number;
}

export default function SearchSortBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}: SearchSortBarProps) {
  return (
    <div className="bg-gray-800 dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8 border border-gray-700">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search motorcycles..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <svg
              className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Sort */}
        <div className="lg:w-64">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-new">Year: Newest First</option>
            <option value="year-old">Year: Oldest First</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-400">
        Showing {filteredCount} of {totalCount} motorcycles
      </div>
    </div>
  );
}
