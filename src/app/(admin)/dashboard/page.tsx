"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../../components/admin";
import { createClient } from "../../../lib/supabase/client";

interface DashboardStats {
  totalMotorcycles: number;
  totalBuyers: number;
  totalSellers: number;
  brandStats: { brand: string; count: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMotorcycles: 0,
    totalBuyers: 0,
    totalSellers: 0,
    brandStats: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();

        // Fetch total available motorcycles (not sold)
        const { count: motorcycleCount } = await supabase
          .from("motorcycles")
          .select("*", { count: "exact", head: true })
          .eq("status", "available");

        // Fetch total buyers
        const { count: buyerCount } = await supabase
          .from("buyers")
          .select("*", { count: "exact", head: true });

        // Fetch total sellers (unique users who have motorcycles)
        const { data: sellersData } = await supabase
          .from("motorcycles")
          .select("user_id")
          .eq("status", "available");

        const uniqueSellers = new Set(sellersData?.map((m) => m.user_id) || []);

        // Fetch brand statistics using a simpler approach
        const { data: brandsData } = await supabase
          .from("brand_statistics")
          .select("*")
          .order("available_motorcycles", { ascending: false });

        const brandStats =
          brandsData?.slice(0, 10).map((brand) => ({
            brand: brand.name,
            count: brand.available_motorcycles || 0,
          })) || [];

        setStats({
          totalMotorcycles: motorcycleCount || 0,
          totalBuyers: buyerCount || 0,
          totalSellers: uniqueSellers.size,
          brandStats,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
            <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      🏍️ <strong>Motorcycles:</strong>
                    </span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {loading ? "..." : stats.totalMotorcycles}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      � <strong>Buyers:</strong>
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {loading ? "..." : stats.totalBuyers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      🏪 <strong>Sellers:</strong>
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {loading ? "..." : stats.totalSellers}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🏍️</div>
                  <div>
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats.totalMotorcycles}
                    </div>
                    <div className="text-orange-100">Available Motorcycles</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">👥</div>
                  <div>
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats.totalBuyers}
                    </div>
                    <div className="text-blue-100">Registered Buyers</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🏪</div>
                  <div>
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats.totalSellers}
                    </div>
                    <div className="text-green-100">Active Sellers</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🏆</div>
                  <div>
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats.brandStats.length}
                    </div>
                    <div className="text-purple-100">Unique Brands</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Motorcycle Stats Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Motorcycle Brands Distribution
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
              ) : stats.brandStats.length > 0 ? (
                <div className="space-y-4">
                  {stats.brandStats.map((brand, index) => {
                    const maxCount = Math.max(
                      ...stats.brandStats.map((b) => b.count)
                    );
                    const percentage = (brand.count / maxCount) * 100;
                    const colors = [
                      "from-orange-500 to-orange-600",
                      "from-blue-500 to-blue-600",
                      "from-green-500 to-green-600",
                      "from-purple-500 to-purple-600",
                      "from-pink-500 to-pink-600",
                      "from-indigo-500 to-indigo-600",
                      "from-red-500 to-red-600",
                      "from-yellow-500 to-yellow-600",
                      "from-teal-500 to-teal-600",
                      "from-gray-500 to-gray-600",
                    ];
                    const colorClass = colors[index % colors.length];

                    return (
                      <div
                        key={brand.brand}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-20 text-sm font-semibold text-gray-800 dark:text-gray-200 flex-shrink-0 capitalize">
                            {brand.brand}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                                <div
                                  className={`bg-gradient-to-r ${colorClass} h-4 rounded-full transition-all duration-1000 ease-out shadow-sm`}
                                  style={{
                                    width: `${percentage}%`,
                                    animationDelay: `${index * 100}ms`,
                                  }}
                                ></div>
                              </div>
                              <div className="text-sm font-bold text-gray-900 dark:text-white w-10 text-right">
                                {brand.count}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">
                                {percentage.toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 w-8">
                            <span className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {stats.brandStats.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl text-gray-400 dark:text-gray-500 mb-3">
                        📊
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        No motorcycle data available yet
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl text-gray-400 dark:text-gray-500 mb-3">
                    📊
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No motorcycle brands data available yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
