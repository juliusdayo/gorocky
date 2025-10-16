"use client";

import { useState } from "react";

interface MotorcycleFormData {
  brand: string;
  year: string;
  odometer: string;
  modelName: string;
  upgrades: string[];
}

interface MotorcycleFormProps {
  onSubmit: (data: MotorcycleFormData) => void;
}

export default function MotorcycleForm({ onSubmit }: MotorcycleFormProps) {
  const [formData, setFormData] = useState<MotorcycleFormData>({
    brand: "",
    year: "",
    odometer: "",
    modelName: "",
    upgrades: [],
  });

  const [currentUpgrade, setCurrentUpgrade] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Second Row - Year and Odometer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            List My Motorcycle
          </button>
        </div>
      </form>
    </div>
  );
}
