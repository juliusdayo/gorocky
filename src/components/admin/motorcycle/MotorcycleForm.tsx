"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import Toast from "./Toast";

interface MotorcycleFormData {
  brand: string;
  year: string;
  odometer: string;
  modelName: string;
  upgrades: string[];
  price: string;
}

interface MotorcycleFormProps {
  onSubmit?: (data: MotorcycleFormData) => void;
  onSuccess?: () => void;
  initialData?: {
    id?: number;
    brand: string;
    year: number;
    odometer: number;
    modelName: string;
    upgrades: string[];
    price: number;
  };
  mode?: "create" | "edit";
}

export default function MotorcycleForm({
  onSubmit,
  onSuccess,
  initialData,
  mode = "create",
}: MotorcycleFormProps) {
  const [formData, setFormData] = useState<MotorcycleFormData>({
    brand: initialData?.brand || "",
    year: initialData?.year?.toString() || "",
    odometer: initialData?.odometer?.toString() || "",
    modelName: initialData?.modelName || "",
    upgrades: initialData?.upgrades || [],
    price: initialData?.price?.toString() || "",
  });

  const [currentUpgrade, setCurrentUpgrade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addUpgrade = () => {
    if (
      currentUpgrade.trim() &&
      !formData.upgrades.includes(currentUpgrade.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        upgrades: [...prev.upgrades, currentUpgrade.trim()],
      }));
      setCurrentUpgrade("");
    }
  };

  const removeUpgrade = (upgradeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      upgrades: prev.upgrades.filter((upgrade) => upgrade !== upgradeToRemove),
    }));
  };

  const handleUpgradeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addUpgrade();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Get the current session for auth token
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Authentication required. Please sign in again.");
      }

      const motorcycleData = {
        brand: formData.brand.trim(),
        modelName: formData.modelName.trim(),
        year: parseInt(formData.year),
        odometer: parseInt(formData.odometer),
        price: parseFloat(formData.price),
        upgrades: formData.upgrades,
        status: "available",
      };

      const isEditMode = mode === "edit" && initialData?.id;
      const url = isEditMode
        ? `/api/motorcycles/${initialData.id}`
        : "/api/motorcycles";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(motorcycleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditMode ? "update" : "create"} motorcycle listing`
        );
      }

      const result = await response.json();
      console.log(`Motorcycle ${isEditMode ? "updated" : "created"}:`, result);

      // Clear form on success only if creating
      if (!isEditMode) {
        setFormData({
          brand: "",
          year: "",
          odometer: "",
          modelName: "",
          upgrades: [],
          price: "",
        });
      }

      // Call optional callbacks
      if (onSubmit) {
        onSubmit(formData);
      }
      if (onSuccess) {
        onSuccess();
      }

      showToast(
        `Motorcycle ${isEditMode ? "updated" : "listed"} successfully!`,
        "success"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        {/* First Row - Brand and Model Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Brand *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Honda, Yamaha, Harley-Davidson"
            />
          </div>

          {/* Model Name */}
          <div>
            <label
              htmlFor="modelName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Model Name *
            </label>
            <input
              type="text"
              id="modelName"
              name="modelName"
              value={formData.modelName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., CBR600RR, R1, Street Glide"
            />
          </div>
        </div>

        {/* Second Row - Year, Odometer, and Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Year */}
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
              min="1900"
              max="2025"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 2020"
            />
          </div>

          {/* Odometer */}
          <div>
            <label
              htmlFor="odometer"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Odometer (miles) *
            </label>
            <input
              type="number"
              id="odometer"
              name="odometer"
              value={formData.odometer}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 15000"
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 12500"
            />
          </div>
        </div>

        {/* Upgrades */}
        <div>
          <label
            htmlFor="upgrades"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Upgrades/Modifications
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentUpgrade}
                onChange={(e) => setCurrentUpgrade(e.target.value)}
                onKeyPress={handleUpgradeKeyPress}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Aftermarket exhaust, LED headlight"
              />
              <button
                type="button"
                onClick={addUpgrade}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            {/* Display added upgrades */}
            {formData.upgrades.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Added upgrades:
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.upgrades.map((upgrade, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{upgrade}</span>
                      <button
                        type="button"
                        onClick={() => removeUpgrade(upgrade)}
                        className="ml-2 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            {isSubmitting
              ? mode === "edit"
                ? "Updating Motorcycle..."
                : "Listing Motorcycle..."
              : mode === "edit"
              ? "Update Motorcycle"
              : "List My Motorcycle"}
          </button>
        </div>
      </form>

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
