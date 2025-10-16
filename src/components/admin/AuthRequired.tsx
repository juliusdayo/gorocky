import Link from "next/link";

interface AuthRequiredProps {
  message?: string;
}

export default function AuthRequired({
  message = "You need to be signed in to access this page.",
}: AuthRequiredProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
          <div className="space-x-4">
            <Link
              href="/auth"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
