import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface AdminHeaderProps {
  user: User;
  onSignOut: () => void;
  showDashboardLink?: boolean;
}

export default function AdminHeader({
  user,
  onSignOut,
  showDashboardLink = true,
}: AdminHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-orange-600 transition-colors"
          >
            GoRocky Motorcycles
          </Link>
          <nav className="flex space-x-8 items-center">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors"
            >
              Home
            </Link>
            {showDashboardLink && (
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors"
              >
                Dashboard
              </Link>
            )}
            <span className="text-gray-600 dark:text-gray-300">
              Welcome, {user.email}
            </span>
            <button
              onClick={onSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
