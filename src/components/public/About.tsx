export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        About GoRocky
      </h2>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Our Story
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Founded with a passion for motorcycles, GoRocky has been connecting
            riders with their perfect bikes for over a decade. We understand
            that every motorcycle has a story, and we&apos;re here to help write
            the next chapter.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Our expertise in the second-hand motorcycle market ensures that both
            buyers and sellers get the best value and service possible.
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-2xl text-white text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h4 className="text-xl font-semibold mb-2">10+ Years</h4>
          <p>Of trusted service in the motorcycle industry</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="text-3xl mb-3">🔧</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Expert Knowledge
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Deep understanding of motorcycle mechanics and market values
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-3xl mb-3">📋</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Thorough Documentation
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Complete service records and transparent history for every bike
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-3xl mb-3">🌟</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Customer Satisfaction
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Committed to ensuring every customer rides away happy
          </p>
        </div>
      </div>
    </div>
  );
}
