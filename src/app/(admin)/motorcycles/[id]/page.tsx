"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchMotorcycleWithBids } from "./functions/fetchMotorcycleWithBids";
import { MotorcycleWithBids } from "./types";
import Toast from "../../../../components/admin/motorcycle/Toast";
import AdminLayout from "../../../../components/admin/AdminLayout";
import {
  MotorcycleDetails,
  SellerInformation,
  BidSummary,
  AllBids,
} from "../../../../components/admin/motorcycle/id";

export default function MotorcycleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const motorcycleId = Number(params.id);

  const [motorcycle, setMotorcycle] = useState<MotorcycleWithBids | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const loadMotorcycleData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchMotorcycleWithBids(motorcycleId);

      if (result.error) {
        setError(result.error);
        showToast(result.error, "error");
      } else if (result.data) {
        setMotorcycle(result.data);
      }
    } catch (error) {
      const errorMessage = "Failed to load motorcycle details";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error loading motorcycle data:", error);
    } finally {
      setLoading(false);
    }
  }, [motorcycleId]);

  useEffect(() => {
    if (motorcycleId) {
      loadMotorcycleData();
    }
  }, [motorcycleId, loadMotorcycleData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        {() => (
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        )}
      </AdminLayout>
    );
  }

  if (error || !motorcycle) {
    return (
      <AdminLayout>
        {() => (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">
              {error || "Motorcycle not found"}
            </div>
            <button
              onClick={() => router.push("/motorcycles")}
              className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ← Back to Motorcycles
            </button>
          </div>
        )}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {() => (
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/motorcycles")}
                className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {motorcycle.year} {motorcycle.brand} {motorcycle.modelName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Motorcycle ID: {motorcycle.id}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(motorcycle.price)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {motorcycle.bids.length} bid
                {motorcycle.bids.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Motorcycle Details */}
            <div className="lg:col-span-2">
              <MotorcycleDetails
                motorcycle={motorcycle}
                formatDate={formatDate}
              />

              {/* Seller Information */}
              <SellerInformation seller={motorcycle.seller} />
            </div>

            {/* Bids Section */}
            <div className="space-y-6">
              {/* Bid Summary */}
              <BidSummary
                bids={motorcycle.bids}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />

              {/* All Bids */}
              <AllBids
                bids={motorcycle.bids}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            </div>
          </div>

          {/* Toast Notifications */}
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={hideToast}
          />
        </div>
      )}
    </AdminLayout>
  );
}
