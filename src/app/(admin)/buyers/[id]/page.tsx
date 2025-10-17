"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminLayout } from "../../../../components/admin";
import {
  BuyerHeader,
  BuyerInformation,
  BuyerBidsList,
  EditBuyerModal,
} from "../../../../components/admin/buyer";
import { Buyer, BidWithMotorcycle } from "../types";
import { fetchBuyers } from "../functions/fetchBuyers";
import { fetchBuyerBids } from "../functions/fetchBuyerBids";
import {
  updateBuyer,
  formatCurrency,
  formatDate,
} from "../functions/buyerUtils";

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

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

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

  // Edit buyer functions
  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setEditError("");
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditError("");
  };

  const handleEditSave = async (updatedData: Partial<Buyer>) => {
    if (!buyer) return;

    try {
      setEditLoading(true);
      setEditError("");

      const updatedBuyer = await updateBuyer(buyer.id, updatedData);

      // Update the local buyer state
      setBuyer(updatedBuyer);
      setIsEditModalOpen(false);

      // Optionally, you could show a success message here
    } catch (error) {
      console.error("Error updating buyer:", error);
      setEditError(
        error instanceof Error ? error.message : "Failed to update buyer"
      );
    } finally {
      setEditLoading(false);
    }
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
          <BuyerHeader buyer={buyer} />

          {/* Buyer Information */}
          <BuyerInformation
            buyer={buyer}
            onEditClick={handleEditClick}
            formatDate={formatDate}
          />

          {/* Bids Section */}
          <BuyerBidsList
            bids={displayBids}
            bidsSortBy={bidsSortBy}
            onSortChange={setBidsSortBy}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />

          {/* Edit Buyer Modal */}
          <EditBuyerModal
            isOpen={isEditModalOpen}
            buyer={buyer}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
            loading={editLoading}
            error={editError}
          />
        </div>
      )}
    </AdminLayout>
  );
}
