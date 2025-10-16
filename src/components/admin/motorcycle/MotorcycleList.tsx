"use client";

import { useState, useEffect, useCallback } from "react";
import MotorcycleFilter from "./MotorcycleFilter";
import MotorcycleCard from "./MotorcycleCard";
import { Motorcycle, MotorcycleFilters } from "./types";
import NotFound from "./NotFound";
import Toast from "./Toast";
import { createClient } from "@/lib/supabase/client";

interface MotorcycleListProps {
  motorcycles?: Motorcycle[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

export default function MotorcycleList({
  motorcycles: propMotorcycles = [],
  loading: propLoading = false,
  error: propError = "",
  onRefresh,
}: MotorcycleListProps) {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(propMotorcycles);
  const [loading, setLoading] = useState(propLoading);
  const [error, setError] = useState(propError);
  const [filters, setFilters] = useState<MotorcycleFilters>({
    brand: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
  });

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
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

  // Sync with prop motorcycles
  useEffect(() => {
    setMotorcycles(propMotorcycles);
    setLoading(propLoading);
    setError(propError);
  }, [propMotorcycles, propLoading, propError]);

  // Filter motorcycles locally
  const filteredMotorcycles = useCallback(() => {
    let filtered = [...motorcycles];

    if (filters.brand) {
      filtered = filtered.filter((motorcycle) =>
        motorcycle.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.minYear) {
      filtered = filtered.filter(
        (motorcycle) => motorcycle.year >= parseInt(filters.minYear)
      );
    }

    if (filters.maxYear) {
      filtered = filtered.filter(
        (motorcycle) => motorcycle.year <= parseInt(filters.maxYear)
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (motorcycle) => motorcycle.price >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (motorcycle) => motorcycle.price <= parseFloat(filters.maxPrice)
      );
    }

    return filtered;
  }, [motorcycles, filters]);

  const displayMotorcycles = filteredMotorcycles();

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      // Get the current session for auth token
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Authentication required. Please sign in again.");
      }

      const response = await fetch(`/api/motorcycles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete motorcycle");
      }

      // Refresh the list after deletion
      if (onRefresh) {
        onRefresh();
      }
      showToast("Motorcycle deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting motorcycle:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete motorcycle";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    // Filters are applied automatically through filteredMotorcycles
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      minYear: "",
      maxYear: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading motorcycles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Motorcycle Listings
        </h2>

        {/* Filters */}
        <MotorcycleFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {displayMotorcycles.length === 0 ? (
        <NotFound filters={filters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMotorcycles.map((motorcycle) => (
            <MotorcycleCard
              key={motorcycle.id}
              motorcycle={motorcycle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
