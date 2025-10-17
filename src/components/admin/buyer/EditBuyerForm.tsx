"use client";

import { useState } from "react";
import { Buyer } from "../../../app/(admin)/buyers/types";

interface EditBuyerFormProps {
  buyer: Buyer;
  onSave: (updatedBuyer: Partial<Buyer>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function EditBuyerForm({
  buyer,
  onSave,
  onCancel,
  loading = false,
}: EditBuyerFormProps) {
  const [formData, setFormData] = useState({
    firstName: buyer.firstName || "",
    lastName: buyer.lastName || "",
    contactEmail: buyer.contactEmail || "",
    contactPhone: buyer.contactPhone || "",
    address: buyer.address || "",
    city: buyer.city || "",
    state: buyer.state || "",
    zipCode: buyer.zipCode || "",
    verified: buyer.verified,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Email is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    // Phone validation (optional but must be valid if provided)
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    // ZIP code validation (optional but must be valid if provided)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code (12345 or 12345-6789)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving buyer:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
              errors.firstName
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={loading}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
              errors.lastName
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={loading}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
              errors.contactEmail
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={loading}
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.contactEmail}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="(555) 123-4567"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
              errors.contactPhone
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={loading}
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.contactPhone}
            </p>
          )}
        </div>
      </div>

      {/* Address Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Street Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="123 Main Street"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          disabled={loading}
        />
      </div>

      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="New York"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="NY"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            placeholder="12345"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
              errors.zipCode
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={loading}
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.zipCode}
            </p>
          )}
        </div>
      </div>

      {/* Verification Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Verification Status
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified"
            name="verified"
            checked={formData.verified}
            onChange={handleInputChange}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded"
            disabled={loading}
          />
          <label
            htmlFor="verified"
            className="ml-2 text-sm text-gray-900 dark:text-white"
          >
            Mark as verified buyer
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
