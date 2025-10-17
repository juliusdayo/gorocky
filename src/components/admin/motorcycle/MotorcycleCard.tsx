"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Motorcycle } from "./types";
import ConfirmationModal from "./ConfirmationModal";

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onDelete: (id: number) => Promise<void>;
  onEdit?: (motorcycle: Motorcycle) => void;
}

export default function MotorcycleCard({
  motorcycle,
  onDelete,
  onEdit,
}: MotorcycleCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    await onDelete(motorcycle.id);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleViewDetails = () => {
    router.push(`/motorcycles/${motorcycle.id}`);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(motorcycle);
    }
  };
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            onClick={handleViewDetails}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors"
            title="Click to view details"
          >
            {motorcycle.year} {motorcycle.brand_name || motorcycle.brand?.name}{" "}
            {motorcycle.modelName}
          </h3>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            ${motorcycle.price.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              title="Edit listing"
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
            </button>
          )}
          <button
            onClick={handleDeleteClick}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            title="Delete listing"
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
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex justify-between">
          <span>Odometer:</span>
          <span className="font-medium">
            {motorcycle.odometer.toLocaleString()} miles
          </span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span
            className={`font-medium capitalize ${
              motorcycle.status === "available"
                ? "text-green-600 dark:text-green-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {motorcycle.status}
          </span>
        </div>
      </div>

      {motorcycle.upgrades.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upgrades:
          </p>
          <div className="flex flex-wrap gap-1">
            {motorcycle.upgrades.map((upgrade, index) => (
              <span
                key={index}
                className="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full"
              >
                {upgrade}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Listed on {new Date(motorcycle.createdAt).toLocaleDateString()}
        </p>
        <button
          onClick={handleViewDetails}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          View Details & Bids →
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Motorcycle Listing"
        message={`Are you sure you want to delete the ${motorcycle.year} ${
          motorcycle.brand_name || motorcycle.brand?.name
        } ${motorcycle.modelName} listing? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="danger"
      />
    </div>
  );
}
