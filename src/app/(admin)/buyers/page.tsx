"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "../../../components/admin";
import { Buyer, BuyerFilters } from "./types";
import { fetchBuyers } from "./functions/fetchBuyers";

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Buyers
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all registered buyers in the system.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            {/* Filters */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Filter Buyers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Search by name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    placeholder="Search by city..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={filters.state}
                    onChange={handleFilterChange}
                    placeholder="Search by state..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Verification
                  </label>
                  <select
                    name="verified"
                    value={filters.verified}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {displayBuyers.length === 0 ? (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No buyers found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {Object.values(filters).some(
                    (value) => value && value !== "all"
                  )
                    ? "Try adjusting your filters to see more buyers."
                    : "No buyers have registered yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayBuyers.map((buyer) => (
                    <div
                      key={buyer.id}
                      onClick={() => handleBuyerClick(buyer.id)}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-orange-300 dark:hover:border-orange-600"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {buyer.firstName} {buyer.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {buyer.id}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {buyer.verified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              <svg
                                className="w-3 h-3 mr-1"
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
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {buyer.contactEmail}
                        </div>
                        {buyer.contactPhone && (
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {buyer.contactPhone}
                          </div>
                        )}
                        {buyer.city && buyer.state && (
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {buyer.city}, {buyer.state}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Registered on{" "}
                          {new Date(buyer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
