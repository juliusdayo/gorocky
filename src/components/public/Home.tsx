import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center">
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
          GoRocky Motorcycles
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Your trusted partner for buying and selling premium second-hand
          motorcycles
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-96 md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-8xl mb-4">🏍️</div>
            <p className="text-2xl font-semibold">Premium Motorcycles</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Quality Inspected
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Every motorcycle is thoroughly inspected for quality and performance
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Fair Pricing
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Competitive prices for both buying and selling motorcycles
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Trusted Service
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Years of experience in the motorcycle resale business
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex gap-4 justify-center flex-col sm:flex-row">
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
          Browse Motorcycles
        </button>
        <Link href="/list-motorcycle">
          <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Sell Your Bike
          </button>
        </Link>
      </div>
    </div>
  );
}
