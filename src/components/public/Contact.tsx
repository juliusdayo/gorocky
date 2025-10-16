export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Get In Touch
      </h2>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Contact Information
          </h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="text-2xl mr-4">📍</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Location
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  123 Motorcycle Lane, Rider City, RC 12345
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-2xl mr-4">📞</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Phone
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  (555) 123-BIKE (2453)
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-2xl mr-4">✉️</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Email
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  info@gorocky.com
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-2xl mr-4">🕒</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Hours
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Mon-Fri: 9AM-7PM
                  <br />
                  Sat: 9AM-5PM
                  <br />
                  Sun: 12PM-4PM
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Send us a message
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white">
                <option>I want to buy a motorcycle</option>
                <option>I want to sell my motorcycle</option>
                <option>General inquiry</option>
                <option>Service question</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
