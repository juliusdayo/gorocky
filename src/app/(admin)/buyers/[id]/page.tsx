"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminLayout } from "../../../../components/admin";
import { Buyer, BidWithMotorcycle } from "../types";
import { fetchBuyers } from "../functions/fetchBuyers";
import { fetchBuyerBids } from "../functions/fetchBuyerBids";

export default function BuyerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [bids, setBids] = useState<BidWithMotorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidsSortBy, setBidsSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");

  const buyerId = Number(id);

  const handleFetchBuyer = useCallback(async () => {
    if (!buyerId || isNaN(buyerId)) {
      setError("Invalid buyer ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [buyerResult, bidsResult] = await Promise.all([
        fetchBuyers(),
        fetchBuyerBids(buyerId),
      ]);

      if (buyerResult.error) {
        setError(buyerResult.error);
        return;
      }

      if (bidsResult.error) {
        setError(bidsResult.error);
        return;
      }

      const foundBuyer = buyerResult.data.find((b) => b.id === buyerId);
      if (!foundBuyer) {
        setError("Buyer not found");
        return;
      }

      setBuyer(foundBuyer);
      setBids(bidsResult.data);
    } catch (err) {
      console.error("Error fetching buyer data:", err);
      setError("An error occurred while fetching buyer data");
    } finally {
      setLoading(false);
    }
  }, [buyerId]);

  useEffect(() => {
    handleFetchBuyer();
  }, [handleFetchBuyer]);

  // Sort bids based on selected sort option
  const sortedBids = useCallback(() => {
    const sorted = [...bids];

    switch (bidsSortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "highest":
        sorted.sort((a, b) => b.bidAmount - a.bidAmount);
        break;
      case "lowest":
        sorted.sort((a, b) => a.bidAmount - b.bidAmount);
        break;
    }

    return sorted;
  }, [bids, bidsSortBy]);

  const displayBids = sortedBids();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout
        authMessage="You need to be signed in to access buyer details."
        showDashboardLink={false}
      >
        {() => (
          <div className="p-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Loading buyer details...
                </p>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout
        authMessage="You need to be signed in to access buyer details."
        showDashboardLink={false}
      >
        {() => (
          <div className="p-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                  <svg
                    className="mx-auto h-12 w-12 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-red-900 dark:text-red-100">
                    Error
                  </h3>
                  <p className="mt-1 text-red-600 dark:text-red-400">{error}</p>
                  <div className="mt-6">
                    <button
                      onClick={() => router.push("/buyers")}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Back to Buyers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    );
  }

  if (!buyer) {
    return null;
  }

  return (
    <AdminLayout
      authMessage="You need to be signed in to access buyer details."
      showDashboardLink={false}
    >
      {() => (
        <div className="p-8">
          {/* Header with back button */}
          <div className="mb-8 flex items-center">
            <button
              onClick={() => router.push("/buyers")}
              className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {buyer.firstName} {buyer.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Buyer ID: {buyer.id}
              </p>
            </div>
          </div>

          {/* Buyer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Buyer Information
              </h2>
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

          {/* Bids Section */}
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
                  onChange={(e) =>
                    setBidsSortBy(e.target.value as typeof bidsSortBy)
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>
            </div>

            {displayBids.length === 0 ? (
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
                {displayBids.map((bid) => (
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
                            <span className="font-medium">Placed:</span>
                            <p>{formatDate(bid.createdAt)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <p className="capitalize">{bid.status}</p>
                          </div>
                        </div>
                        {bid.message && (
                          <div className="mt-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Message:
                            </span>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {bid.message}
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
        </div>
      )}
    </AdminLayout>
  );
}
