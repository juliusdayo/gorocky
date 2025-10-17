"use client";

import EditBuyerForm from "./EditBuyerForm";
import { Buyer } from "../../../app/(admin)/buyers/types";

interface EditBuyerModalProps {
  isOpen: boolean;
  buyer: Buyer;
  onSave: (updatedData: Partial<Buyer>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  error?: string;
}

export default function EditBuyerModal({
  isOpen,
  buyer,
  onSave,
  onCancel,
  loading,
  error,
}: EditBuyerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Buyer Details
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Edit Form */}
          <EditBuyerForm
            buyer={buyer}
            onSave={onSave}
            onCancel={onCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
