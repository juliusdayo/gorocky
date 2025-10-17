"use client";

import { MotorcycleWithBids } from "../../../../app/(admin)/motorcycles/[id]/types";

interface MotorcycleDetailsProps {
  motorcycle: MotorcycleWithBids;
  formatDate: (dateString: string) => string;
}

export default function MotorcycleDetails({
  motorcycle,
  formatDate,
}: MotorcycleDetailsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Motorcycle Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Brand</dt>
          <dd className="text-sm text-gray-900 dark:text-white">{motorcycle.brand}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Model</dt>
          <dd className="text-sm text-gray-900 dark:text-white">{motorcycle.modelName}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Year</dt>
          <dd className="text-sm text-gray-900 dark:text-white">{motorcycle.year}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Odometer</dt>
          <dd className="text-sm text-gray-900 dark:text-white">
            {motorcycle.odometer.toLocaleString()} miles
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Status</dt>
          <dd className="text-sm">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                motorcycle.status === "available"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : motorcycle.status === "sold"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              }`}
            >
              {motorcycle.status}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Listed</dt>
          <dd className="text-sm text-gray-900 dark:text-white">
            {formatDate(motorcycle.createdAt)}
          </dd>
        </div>
      </div>

      {motorcycle.upgrades && motorcycle.upgrades.length > 0 && (
        <div className="mt-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">Upgrades</dt>
          <div className="flex flex-wrap gap-2">
            {motorcycle.upgrades.map((upgrade, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
              >
                {upgrade}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
