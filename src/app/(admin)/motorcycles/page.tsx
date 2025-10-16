"use client";

import { AdminLayout } from "../../../components/admin";

export default function MotorcyclesPage() {
  return (
    <AdminLayout
      authMessage="You need to be signed in to access motorcycles."
      showDashboardLink={false}
    >
      {() => (
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Motorcycles
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage all motorcycles in the system.
            </p>
          </div>

          {/* Placeholder content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏍️</div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Motorcycles Management
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This page will contain motorcycle listings, search, and
                management features.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Coming soon...
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
