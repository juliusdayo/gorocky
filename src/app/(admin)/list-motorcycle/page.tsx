"use client";

import Link from "next/link";
import { AdminLayout, MotorcycleForm } from "../../../components/admin";

export default function ListMotorcyclePage() {
  const handleFormSubmit = (formData: {
    brand: string;
    year: string;
    odometer: string;
    modelName: string;
    upgrades: string[];
  }) => {
    // TODO: Handle form submission (send to API, database, etc.)
    console.log("Form submitted:", formData);
    alert(
      "Motorcycle listing submitted! (This would normally save to a database)"
    );
  };

  return (
    <AdminLayout authMessage="You need to be signed in to list a motorcycle.">
      {() => (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              List Your Motorcycle
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Fill out the form below to list your motorcycle for sale on
              GoRocky.
            </p>
          </div>

          <MotorcycleForm onSubmit={handleFormSubmit} />

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Link
              href="/dashboard"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </main>
      )}
    </AdminLayout>
  );
}
