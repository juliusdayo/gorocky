"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AdminLayout,
  MotorcycleList,
  MotorcycleForm,
} from "../../../components/admin";
import { Motorcycle } from "./types";
import { fetchMotorcycles } from "./functions/fetchMotorcycles";

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFetchMotorcycles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchMotorcycles();

      if (result.error) {
        setError(result.error);
        return;
      }

      setMotorcycles(result.data);
    } catch (err) {
      console.error("Error fetching motorcycles:", err);
      setError("An error occurred while fetching motorcycles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchMotorcycles();
  }, [handleFetchMotorcycles]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    handleFetchMotorcycles(); // Refresh the list after adding a new motorcycle
  };

  return (
    <AdminLayout
      authMessage="You need to be signed in to access motorcycles."
      showDashboardLink={false}
    >
      {() => (
        <div className="p-8">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Motorcycles
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                View and manage all motorcycles in the system.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Motorcycle
            </button>
          </div>

          <MotorcycleList
            motorcycles={motorcycles}
            loading={loading}
            error={error}
            onRefresh={handleFetchMotorcycles}
          />

          {/* Modal */}
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={handleModalBackdropClick}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Motorcycle
                  </h2>
                  <button
                    onClick={handleModalClose}
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
                  <MotorcycleForm onSuccess={handleFormSuccess} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
