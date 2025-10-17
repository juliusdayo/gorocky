import Link from "next/link";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-orange-600">🏍️ GoRocky</div>
          </div>
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "home"
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:text-orange-600"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "about"
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:text-orange-600"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "contact"
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:text-orange-600"
              }`}
            >
              Contact
            </button>
            <Link
              href="/motorcycle-listing"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Motorcycles
            </Link>
            <Link
              href="/auth"
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
