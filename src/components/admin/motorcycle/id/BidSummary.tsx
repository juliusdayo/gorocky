"use client";

import { BidWithBuyer } from "../../../../app/(admin)/motorcycles/[id]/types";

interface BidSummaryProps {
  bids: BidWithBuyer[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export default function BidSummary({
  bids,
  formatCurrency,
  formatDate,
}: BidSummaryProps) {
  const highestBid = bids.length > 0 ? bids[0] : null;
  const totalBids = bids.length;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Bidding Summary
      </h2>

      {highestBid ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Highest Bid</span>
            <span className="text-lg font-bold text-orange-600">
              {formatCurrency(highestBid.bidAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Bids</span>
            <span className="font-medium">{totalBids}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Latest Bid</span>
            <span className="text-sm text-gray-900">
              {formatDate(highestBid.createdAt)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-4xl text-gray-400 mb-2">💰</div>
          <p className="text-sm text-gray-600">No bids yet</p>
        </div>
      )}
    </div>
  );
}
