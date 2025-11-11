import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vehicles/trending");
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // ✅ Memoize filtering to avoid re-computation on each render
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase());
      const matchesType = type === "all" || v.type === type;
      const matchesPrice = v.price >= minPrice && v.price <= maxPrice;
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [vehicles, search, type, minPrice, maxPrice]);

  const resetFilters = () => {
    setSearch("");
    setType("all");
    setMinPrice(0);
    setMaxPrice(2000000);
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder.jpg";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* 🌠 Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-4">Find Your Perfect Ride</h2>
          <p className="text-blue-100 text-lg">
            Compare, explore, and discover trending vehicles tailored for your needs — all in one place.
          </p>
        </div>
      </section>

      {/* 🎛️ Filters Section */}
      <section className="max-w-7xl mx-auto px-6 py-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md -mt-10 relative z-10">
        <div className="flex flex-wrap gap-6 justify-center md:justify-between items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 w-64 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Type Selector */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="car">Cars</option>
            <option value="bike">Bikes</option>
          </select>

          {/* Price Range */}
          <div className="flex flex-col items-center">
            <label className="text-gray-700 dark:text-gray-300 text-sm mb-1">
              Price Range (₹{minPrice.toLocaleString()} – ₹{maxPrice.toLocaleString()})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="accent-blue-600"
              />
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-blue-600"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
          >
            Reset Filters
          </button>
        </div>
      </section>

      {/* 🚗 Trending Section */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-8 flex items-center">
          <span className="text-3xl mr-2">🔥</span> Trending Vehicles
        </h3>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-56"
              ></div>
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No vehicles found for selected filters.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredVehicles.map((v) => (
              <div
                key={v._id}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-4 flex flex-col"
              >
                <img
                  src={v.image || "/placeholder.jpg"}
                  alt={v.name}
                  onError={handleImageError}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mt-3">
                  {v.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{v.brand}</p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mt-1">
                  ₹{v.price?.toLocaleString()}
                </p>

                <Link
                  to={`/vehicle/${v._id}`}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-center transition block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ⚙️ Footer */}
      <footer className="bg-white dark:bg-gray-800 text-center py-6 mt-10 border-t dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="text-blue-600 font-semibold">DriveMatch</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
