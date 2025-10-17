"use client";

import { useRouter } from "next/navigation";
import { BidWithMotorcycle } from "../../../app/(admin)/buyers/types";

interface BuyerBidsListProps {
  bids: BidWithMotorcycle[];
  bidsSortBy: "newest" | "oldest" | "highest" | "lowest";
  onSortChange: (sortBy: "newest" | "oldest" | "highest" | "lowest") => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

export default function BuyerBidsList({
  bids,
  bidsSortBy,
  onSortChange,
  formatCurrency,
  formatDate,
}: BuyerBidsListProps) {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Bids ({bids.length})
        </h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by:
          </label>
          <select
            value={bidsSortBy}
            onChange={(e) => onSortChange(e.target.value as typeof bidsSortBy)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No bids found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This buyer hasn&apos;t placed any bids yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {bid.motorcycle?.year} {bid.motorcycle?.brand}{" "}
                    {bid.motorcycle?.modelName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Bid Amount:</span>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(bid.bidAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            bid.status === "accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : bid.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : bid.status === "withdrawn"
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }`}
                        >
                          {bid.status.charAt(0).toUpperCase() +
                            bid.status.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Bid Date:</span>
                      <p>{formatDate(bid.createdAt)}</p>
                    </div>
                  </div>
                  {bid.message && (
                    <div className="mt-3">
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        Message:
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {bid.message}
                      </p>
                    </div>
                  )}
                  {bid.expiresAt && (
                    <div className="mt-2">
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        Expires:
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(bid.expiresAt)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <button
                    onClick={() =>
                      router.push(`/motorcycles/${bid.motorcycleId}`)
                    }
                    className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium transition-colors"
                  >
                    View Motorcycle →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
