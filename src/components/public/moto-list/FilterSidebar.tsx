"use client";

import { MotorcycleFilters } from "../types";

interface FilterSidebarProps {
  filters: MotorcycleFilters;
  onFiltersChange: (filters: MotorcycleFilters) => void;
  brands: string[];
  hasActiveFilters: boolean;
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  brands,
  hasActiveFilters,
}: FilterSidebarProps) {
  const handleFilterChange = (key: keyof MotorcycleFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      brand: "",
      minYear: "",
      maxYear: "",
      minPrice: "",
      maxPrice: "",
      status: "available",
    });
  };

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-gray-800 dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-700 sticky top-8">
        <h3 className="text-lg font-semibold text-white mb-6">
          Filter Motorcycles
        </h3>

        <div className="space-y-6">
          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Brand
            </label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Year Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min Year"
                value={filters.minYear}
                onChange={(e) => handleFilterChange("minYear", e.target.value)}
                className="p-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="number"
                placeholder="Max Year"
                value={filters.maxYear}
                onChange={(e) => handleFilterChange("maxYear", e.target.value)}
                className="p-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="p-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="p-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 border border-gray-600"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
