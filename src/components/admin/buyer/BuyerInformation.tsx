"use client";

import { Buyer } from "../../../app/(admin)/buyers/types";

interface BuyerInformationProps {
  buyer: Buyer;
  onEditClick: () => void;
  formatDate: (date: string) => string;
}

export default function BuyerInformation({
  buyer,
  onEditClick,
  formatDate,
}: BuyerInformationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Buyer Information
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={onEditClick}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Details
          </button>
          <div className="flex items-center">
            {buyer.verified ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <p className="text-gray-900 dark:text-white">
              {buyer.firstName} {buyer.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <p className="text-gray-900 dark:text-white">
              {buyer.contactEmail}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <p className="text-gray-900 dark:text-white">
              {buyer.contactPhone || "Not provided"}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <p className="text-gray-900 dark:text-white">
              {buyer.city && buyer.state
                ? `${buyer.city}, ${buyer.state}`
                : "Not provided"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Registered
            </label>
            <p className="text-gray-900 dark:text-white">
              {formatDate(buyer.createdAt)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Updated
            </label>
            <p className="text-gray-900 dark:text-white">
              {formatDate(buyer.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
