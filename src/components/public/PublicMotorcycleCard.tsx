"use client";

import { Motorcycle } from "./types";

interface PublicMotorcycleCardProps {
  motorcycle: Motorcycle;
  onViewDetails: (id: number) => void;
}

export default function PublicMotorcycleCard({
  motorcycle,
  onViewDetails,
}: PublicMotorcycleCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gray-800 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-700">
      {/* Placeholder for motorcycle image */}
      <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
        <div className="text-center text-orange-400">
          <svg
            className="w-16 h-16 mx-auto mb-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z" />
          </svg>
          <p className="text-sm font-medium">Motorcycle Photo</p>
        </div>
      </div>

      <div className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <h3
            onClick={() => onViewDetails(motorcycle.id)}
            className="text-lg font-semibold text-white hover:text-orange-400 cursor-pointer transition-colors"
          >
            {motorcycle.year} {motorcycle.brand_name || motorcycle.brand?.name}{" "}
            {motorcycle.modelName}
          </h3>
          <p className="text-2xl font-bold text-orange-400 mt-1">
            {formatCurrency(motorcycle.price)}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div className="flex justify-between">
            <span>Mileage:</span>
            <span className="font-medium text-gray-200">
              {motorcycle.odometer.toLocaleString()} miles
            </span>
          </div>
          <div className="flex justify-between">
            <span>Year:</span>
            <span className="font-medium text-gray-200">{motorcycle.year}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span
              className={`font-medium capitalize ${
                motorcycle.status === "available"
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            >
              {motorcycle.status}
            </span>
          </div>
        </div>

        {/* Upgrades */}
        {motorcycle.upgrades.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-300 mb-2">Upgrades:</p>
            <div className="flex flex-wrap gap-1">
              {motorcycle.upgrades
                .slice(0, 3)
                .map((upgrade: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block bg-orange-900/30 text-orange-300 text-xs px-2 py-1 rounded-full border border-orange-700"
                  >
                    {upgrade}
                  </span>
                ))}
              {motorcycle.upgrades.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{motorcycle.upgrades.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(motorcycle.id)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          View Details & Bid
        </button>
      </div>
    </div>
  );
}
