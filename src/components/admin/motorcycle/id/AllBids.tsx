"use client";

import { BidWithBuyer } from "../../../../app/(admin)/motorcycles/[id]/types";

interface AllBidsProps {
  bids: BidWithBuyer[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  onAcceptBid?: (bidId: number) => Promise<void>;
  onRejectBid?: (bidId: number) => Promise<void>;
}

export default function AllBids({
  bids,
  formatCurrency,
  formatDate,
  onAcceptBid,
  onRejectBid,
}: AllBidsProps) {
  const totalBids = bids.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "accepted":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      case "withdrawn":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getBidStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return "✓";
      case "rejected":
        return "✗";
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        All Bids ({totalBids})
      </h2>

      {bids.length > 0 ? (
        <div className="space-y-4">
          {bids.map((bid: BidWithBuyer, index: number) => (
            <div
              key={bid.id}
              className={`border rounded-lg p-4 ${
                index === 0
                  ? "border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {bid.buyer.firstName} {bid.buyer.lastName}
                  </span>
                  {bid.buyer.verified && (
                    <span className="text-orange-500 dark:text-orange-400">
                      ✓
                    </span>
                  )}
                  {getBidStatusIcon(bid.status) && (
                    <span
                      className={`${
                        bid.status === "accepted"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {getBidStatusIcon(bid.status)}
                    </span>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    bid.status
                  )}`}
                >
                  {bid.status}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(bid.bidAmount)}
                </span>
                {index === 0 && (
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                    Highest Bid
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>{formatDate(bid.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📍</span>
                    <span>
                      {bid.buyer.city}, {bid.buyer.state}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span>📧</span>
                    <span>{bid.buyer.contactEmail}</span>
                  </div>
                  {bid.buyer.contactPhone && (
                    <div className="flex items-center space-x-1">
                      <span>📞</span>
                      <span>{bid.buyer.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {bid.message && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Message: </span>
                  {bid.message}
                </div>
              )}

              {bid.expiresAt && (
                <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                  Expires: {formatDate(bid.expiresAt)}
                </div>
              )}

              {/* Accept/Reject Buttons - only show for pending bids */}
              {bid.status === "pending" && (onAcceptBid || onRejectBid) && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex space-x-2">
                  {onAcceptBid && (
                    <button
                      onClick={() => onAcceptBid(bid.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Accept
                    </button>
                  )}
                  {onRejectBid && (
                    <button
                      onClick={() => onRejectBid(bid.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Reject
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl text-gray-400 dark:text-gray-500 mb-3">
            💰
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No bids have been placed yet
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Bids will appear here as they are submitted
          </p>
        </div>
      )}
    </div>
  );
}
