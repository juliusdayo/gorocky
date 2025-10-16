"use client";

import Link from "next/link";
import { AdminLayout } from "../../../components/admin";

export default function DashboardPage() {
  return (
    <AdminLayout
      authMessage="You need to be signed in to access the dashboard."
      showDashboardLink={false}
    >
      {(user) => (
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome back, {user.email}
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  href="/"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            {/* User Info Card */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Account Information
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>User ID:</strong> {user.id}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Last Sign In:</strong>{" "}
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    🏍️ <strong>Motorcycles Listed:</strong> 0
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    💾 <strong>Saved Motorcycles:</strong> 0
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    📧 <strong>Messages:</strong> 0
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <Link
                    href="/list-motorcycle"
                    className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-center"
                  >
                    List a Motorcycle
                  </Link>
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Browse Motorcycles
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No recent activity. Start by listing your first motorcycle!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
