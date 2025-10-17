"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";
import {
  Motorcycle,
  MotorcycleFilters,
} from "../../../components/public/types";
import Header from "../../../components/public/Header";
import Footer from "../../../components/public/Footer";
import PublicLayout from "../../../components/public/PublicLayout";
import {
  FilterSidebar,
  MotorcycleGrid,
  SearchSortBar,
} from "../../../components/public/moto-list";
import {
  filterAndSortMotorcycles,
  extractUniqueBrands,
  hasActiveFilters,
} from "../../../functions/motorcycleFiltering";

export default function PublicMotorcyclesPage() {
  const router = useRouter();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("motorcycles");

  const [filters, setFilters] = useState<MotorcycleFilters>({
    brand: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
    status: "available", // Default to available motorcycles
  });

  // Get unique brands for filter dropdown
  const brands = extractUniqueBrands(motorcycles);

  // Check if filters are active
  const hasActiveFiltersValue = hasActiveFilters(filters);

  // Fetch motorcycles from Supabase
  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from("motorcycles")
          .select("*")
          .eq("status", "available") // Only show available motorcycles
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching motorcycles:", error);
          setError("Failed to load motorcycles");
        } else {
          setMotorcycles(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycles();
  }, []);

  // Apply filters and search
  useEffect(() => {
    const filtered = filterAndSortMotorcycles({
      motorcycles,
      searchTerm,
      filters,
      sortBy,
    });

    setFilteredMotorcycles(filtered);
  }, [motorcycles, searchTerm, filters, sortBy]);

  const handleViewDetails = (id: number) => {
    router.push(`/motorcycles/${id}`);
  };

  if (loading) {
    return (
      <PublicLayout>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading motorcycles...</p>
          </div>
        </div>
        <Footer />
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Browse Motorcycles
          </h1>
          <p className="text-gray-600">
            Find your perfect ride from our collection of quality motorcycles
          </p>
        </div>

        {/* Search and Sort Bar */}
        <SearchSortBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={motorcycles.length}
          filteredCount={filteredMotorcycles.length}
        />

        {/* Motorcycle Grid with Sidebar Filter */}
        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            brands={brands}
            hasActiveFilters={hasActiveFiltersValue}
          />
          <MotorcycleGrid
            motorcycles={filteredMotorcycles}
            onViewDetails={handleViewDetails}
            onClearFilters={() => {
              setSearchTerm("");
              setFilters({
                brand: "",
                minYear: "",
                maxYear: "",
                minPrice: "",
                maxPrice: "",
                status: "available",
              });
            }}
          />
        </div>
      </main>

      <Footer />
    </PublicLayout>
  );
}
