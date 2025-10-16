"use client";
import Link from "next/link";
import AuthForm from "../../components/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to GoRocky
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GoRocky Account
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Sign in to access exclusive motorcycle deals and manage your
            listings
          </p>
        </div>

        <AuthForm
          onAuthSuccess={(user) => {
            console.log("User signed in:", user.email);
            // Redirect to dashboard after successful authentication
            window.location.href = "/dashboard";
          }}
        />

        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Benefits of Having an Account
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>🏍️ List your motorcycles for sale</li>
              <li>💾 Save favorite motorcycles</li>
              <li>📧 Get notifications for new listings</li>
              <li>🔒 Secure messaging with buyers/sellers</li>
              <li>📊 Track your listing performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
