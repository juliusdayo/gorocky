"use client";

import Link from "next/link";
import { AdminLayout, MotorcycleForm } from "../../../components/admin";

export default function ListMotorcyclePage() {
  const handleFormSuccess = () => {
    // Optionally redirect to motorcycles list or show success message
    console.log("Motorcycle listed successfully!");
  };

  return (
    <AdminLayout authMessage="You need to be signed in to list a motorcycle.">
      {() => (
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                List Your Motorcycle
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Fill out the form below to list your motorcycle for sale on
                GoRocky.
              </p>
            </div>

            <MotorcycleForm onSuccess={handleFormSuccess} />

            {/* Back to Dashboard */}
            <div className="mt-8 text-center">
              <Link
                href="/dashboard"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
