"use client";

import { Motorcycle } from "../types";
import PublicMotorcycleCard from "../PublicMotorcycleCard";

interface MotorcycleGridProps {
  motorcycles: Motorcycle[];
  onViewDetails: (id: number) => void;
  onClearFilters: () => void;
}

export default function MotorcycleGrid({
  motorcycles,
  onViewDetails,
  onClearFilters,
}: MotorcycleGridProps) {
  if (motorcycles.length > 0) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {motorcycles.map((motorcycle) => (
            <PublicMotorcycleCard
              key={motorcycle.id}
              motorcycle={motorcycle}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-24 h-24 mx-auto"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No motorcycles found
        </h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your search or filters to find more results.
        </p>
        <button
          onClick={onClearFilters}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          Clear Search & Filters
        </button>
      </div>
    </div>
  );
}
