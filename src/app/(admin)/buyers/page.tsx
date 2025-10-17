"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "../../../components/admin";
import {
  EditBuyerModal,
  BuyersFilter,
  BuyersDataTable,
} from "../../../components/admin/buyer";
import { Buyer, BuyerFilters } from "./types";
import { fetchBuyers } from "./functions/fetchBuyers";
import { updateBuyer } from "./functions/buyerUtils";

export default function BuyersPage() {
  const router = useRouter();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<BuyerFilters>({
    name: "",
    city: "",
    state: "",
    verified: "all",
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const handleFetchBuyers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchBuyers();

      if (result.error) {
        setError(result.error);
        return;
      }

      setBuyers(result.data);
    } catch (err) {
      console.error("Error fetching buyers:", err);
      setError("An error occurred while fetching buyers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchBuyers();
  }, [handleFetchBuyers]);

  // Filter buyers based on filters
  const filteredBuyers = useCallback(() => {
    let filtered = [...buyers];

    if (filters.name) {
      filtered = filtered.filter((buyer) =>
        `${buyer.firstName} ${buyer.lastName}`
          .toLowerCase()
          .includes(filters.name.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter((buyer) =>
        buyer.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.state) {
      filtered = filtered.filter((buyer) =>
        buyer.state?.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    if (filters.verified !== "all") {
      filtered = filtered.filter((buyer) =>
        filters.verified === "verified" ? buyer.verified : !buyer.verified
      );
    }

    return filtered;
  }, [buyers, filters]);

  const displayBuyers = filteredBuyers();

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      city: "",
      state: "",
      verified: "all",
    });
  };

  const handleBuyerClick = (buyerId: number) => {
    router.push(`/buyers/${buyerId}`);
  };

  // Modal handlers
  const handleAddBuyer = () => {
    setModalMode("add");
    setSelectedBuyer(null);
    setIsModalOpen(true);
    setModalError("");
  };

  const handleEditBuyer = (buyer: Buyer) => {
    setModalMode("edit");
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
    setModalError("");
  };

  const handleDeleteBuyer = async (buyer: Buyer) => {
    if (
      !confirm(
        `Are you sure you want to delete ${buyer.firstName} ${buyer.lastName}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/buyers/${buyer.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to delete buyer" }));
        throw new Error(errorData.error);
      }

      // Refresh the buyers list
      await handleFetchBuyers();
    } catch (error) {
      console.error("Error deleting buyer:", error);
      alert(
        `Failed to delete buyer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleModalSave = async (updatedData: Partial<Buyer>) => {
    try {
      setModalLoading(true);
      setModalError("");

      if (modalMode === "add") {
        // Create new buyer
        const response = await fetch("/api/buyers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create buyer");
        }
      } else {
        // Update existing buyer
        if (!selectedBuyer) return;
        await updateBuyer(selectedBuyer.id, updatedData);
      }

      // Refresh the buyers list
      await handleFetchBuyers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving buyer:", error);
      setModalError(
        error instanceof Error ? error.message : "Failed to save buyer"
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setModalError("");
  };

  if (loading) {
    return (
      <AdminLayout
        authMessage="You need to be signed in to access buyers."
        showDashboardLink={false}
      >
        {() => (
          <div className="p-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Loading buyers...
                </p>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      authMessage="You need to be signed in to access buyers."
      showDashboardLink={false}
    >
      {() => (
        <div className="p-8">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Buyers
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                View and manage all registered buyers in the system.
              </p>
            </div>
            <button
              onClick={handleAddBuyer}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Add Buyer</span>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            {/* Filters */}
            <BuyersFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <BuyersDataTable
              buyers={displayBuyers}
              filters={filters}
              onView={handleBuyerClick}
              onEdit={handleEditBuyer}
              onDelete={handleDeleteBuyer}
            />
          </div>

          {/* Add/Edit Buyer Modal */}
          {(modalMode === "edit" ? selectedBuyer : true) && (
            <EditBuyerModal
              isOpen={isModalOpen}
              buyer={
                modalMode === "edit" && selectedBuyer
                  ? selectedBuyer
                  : {
                      id: 0,
                      userId: "",
                      firstName: "",
                      lastName: "",
                      contactEmail: "",
                      contactPhone: "",
                      address: "",
                      city: "",
                      state: "",
                      zipCode: "",
                      verified: false,
                      createdAt: "",
                      updatedAt: "",
                    }
              }
              onSave={handleModalSave}
              onCancel={handleModalCancel}
              loading={modalLoading}
              error={modalError}
            />
          )}
        </div>
      )}
    </AdminLayout>
  );
}
