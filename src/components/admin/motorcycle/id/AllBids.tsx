"use client";

import { BidWithBuyer } from "../../../../app/(admin)/motorcycles/[id]/types";

interface AllBidsProps {
  bids: BidWithBuyer[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export default function AllBids({
  bids,
  formatCurrency,
  formatDate,
}: AllBidsProps) {
  const totalBids = bids.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        All Bids ({totalBids})
      </h2>

      {bids.length > 0 ? (
        <div className="space-y-4">
          {bids.map((bid: BidWithBuyer, index: number) => (
            <div
              key={bid.id}
              className={`border rounded-lg p-4 ${
                index === 0
                  ? "border-orange-200 bg-orange-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {bid.buyer.firstName} {bid.buyer.lastName}
                  </span>
                  {bid.buyer.verified && (
                    <span className="text-orange-500">✓</span>
                  )}
                  {getBidStatusIcon(bid.status) && (
                    <span
                      className={`${
                        bid.status === "accepted"
                          ? "text-orange-600"
                          : "text-red-600"
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
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(bid.bidAmount)}
                </span>
                {index === 0 && (
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Highest Bid
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-600 space-y-1">
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
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                  <span className="font-medium">Message: </span>
                  {bid.message}
                </div>
              )}

              {bid.expiresAt && (
                <div className="mt-2 text-xs text-orange-600">
                  Expires: {formatDate(bid.expiresAt)}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl text-gray-400 mb-3">💰</div>
          <p className="text-sm text-gray-600">No bids have been placed yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Bids will appear here as they are submitted
          </p>
        </div>
      )}
    </div>
  );
}
