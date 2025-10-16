"use client";

import { MotorcycleFilters } from "./types";

interface MotorcycleFilterProps {
  filters: MotorcycleFilters;
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function MotorcycleFilter({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: MotorcycleFilterProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={filters.brand}
            onChange={onFilterChange}
            placeholder="e.g., Honda"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Year
          </label>
          <input
            type="number"
            name="minYear"
            value={filters.minYear}
            onChange={onFilterChange}
            placeholder="2000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Year
          </label>
          <input
            type="number"
            name="maxYear"
            value={filters.maxYear}
            onChange={onFilterChange}
            placeholder="2024"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={onFilterChange}
            placeholder="5000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={onFilterChange}
            placeholder="50000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onApplyFilters}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-md transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
