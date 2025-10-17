"use client";

import { MotorcycleWithBids } from "../../../../app/(admin)/motorcycles/[id]/types";

interface SellerInformationProps {
  seller: MotorcycleWithBids["seller"];
}

export default function SellerInformation({ seller }: SellerInformationProps) {
  if (!seller) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Seller Information
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {seller.businessName}
            </h3>
            {seller.verified && (
              <span
                className="text-orange-500 dark:text-orange-400"
                title="Verified Seller"
              >
                ✓
              </span>
            )}
          </div>
          {seller.rating && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              ★ {seller.rating}/5
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 dark:text-gray-500">📧</span>
            <span className="text-gray-900 dark:text-white">
              {seller.contactEmail}
            </span>
          </div>
          {seller.contactPhone && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 dark:text-gray-500">📞</span>
              <span className="text-gray-900 dark:text-white">
                {seller.contactPhone}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 dark:text-gray-500">📍</span>
            <span className="text-gray-900 dark:text-white">
              {seller.city}, {seller.state}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
