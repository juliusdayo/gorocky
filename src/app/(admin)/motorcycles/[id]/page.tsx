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
import { MotorcycleForm, ConfirmationModal } from "../../../../components/admin/motorcycle";
import { createClient } from "../../../../lib/supabase/client";

export default function MotorcycleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const motorcycleId = Number(params.id);

  const [motorcycle, setMotorcycle] = useState<MotorcycleWithBids | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isEditModalOpen) {
          setIsEditModalOpen(false);
        }
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isEditModalOpen, isDeleteModalOpen]);

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

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!motorcycle) return;

    try {
      setIsDeleting(true);

      // Get the current session for auth token
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Authentication required. Please sign in again.");
      }

      const response = await fetch(`/api/motorcycles/${motorcycle.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete motorcycle");
      }

      showToast("Motorcycle deleted successfully!", "success");
      
      // Redirect to motorcycles list after successful deletion
      setTimeout(() => {
        router.push("/motorcycles");
      }, 1500);
      
    } catch (err) {
      console.error("Error deleting motorcycle:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete motorcycle";
      showToast(errorMessage, "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    loadMotorcycleData(); // Refresh the motorcycle data
    showToast("Motorcycle updated successfully!", "success");
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
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(motorcycle.price)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {motorcycle.bids.length} bid
                  {motorcycle.bids.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
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

          {/* Edit Modal */}
          {isEditModalOpen && motorcycle && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsEditModalOpen(false);
                }
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Motorcycle
                  </h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <MotorcycleForm
                    onSuccess={handleEditSuccess}
                    initialData={{
                      id: motorcycle.id,
                      brand: motorcycle.brand,
                      year: motorcycle.year,
                      odometer: motorcycle.odometer,
                      modelName: motorcycle.modelName,
                      upgrades: motorcycle.upgrades,
                      price: motorcycle.price,
                    }}
                    mode="edit"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            title="Delete Motorcycle Listing"
            message={`Are you sure you want to delete the ${motorcycle?.year} ${motorcycle?.brand} ${motorcycle?.modelName} listing? This action cannot be undone and will also remove all associated bids.`}
            confirmText={isDeleting ? "Deleting..." : "Delete"}
            cancelText="Cancel"
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
            type="danger"
          />
        </div>
      )}
    </AdminLayout>
  );
}
