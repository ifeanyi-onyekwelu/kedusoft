import formatAmount from "../../../../utils/helpers";

function MajorCityCard({ city, listings }: any) {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* City Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={""}
          alt={city}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* City badge */}
        <div className="absolute top-4 right-4 rounded-full bg-white px-3 py-1 text-sm font-medium shadow-md">
          {formatAmount(listings)} Listings
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white p-5">
        <h3 className="text-xl font-bold text-gray-900">{city}</h3>

        <div className="mt-6 flex items-center justify-between">
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Listings
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function MajorCities() {
  const cities = [
    { city: "Abuja", listings: 8000 },
    { city: "Enugu", listings: 12000 },
    { city: "Port-Harcourt", listings: 9000 },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-900 to-indigo-800 py-16">
      <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Major Cities
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Discover properties in Nigeria's most vibrant urban centers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {city.city}
                </h3>
                <p className="text-indigo-600 font-semibold">
                  {city.listings.toLocaleString()}+ properties
                </p>
                <div className="mt-6 h-48 bg-gray-200 border-2 border-dashed rounded-xl" />
                <button className="mt-6 w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Explore Properties
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-full shadow-md hover:bg-gray-100 transition-colors">
            View All Cities
          </button>
        </div>
      </div>
    </section>
  );
}

export default MajorCities;
