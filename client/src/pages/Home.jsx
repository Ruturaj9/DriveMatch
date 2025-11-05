import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles/trending");
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* 🔹 Navbar */}
      <nav className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600">DriveMatch 🚗</h1>
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 w-64 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </nav>

      {/* 🌠 Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-4">
            Find Your Perfect Ride
          </h2>
          <p className="text-blue-100 text-lg">
            Compare, explore, and discover trending vehicles tailored for your
            needs — all in one place.
          </p>
        </div>
      </section>

      {/* 🚗 Trending Section */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-8 flex items-center">
          <span className="text-3xl mr-2">🔥</span> Trending Vehicles
        </h3>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading trending vehicles...
          </p>
        ) : filteredVehicles.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No vehicles found.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredVehicles.map((v) => (
              <div
                key={v._id}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-4 flex flex-col"
              >
                <div className="relative">
                  <img
                    src={v.image || "/placeholder.jpg"}
                    alt={v.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  {v.isTrending && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-lg">
                      Trending
                    </span>
                  )}
                </div>

                <div className="mt-4 flex-1">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                    {v.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {v.brand}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                    ₹{v.price?.toLocaleString()}
                  </p>
                </div>

                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ⚙️ Footer */}
      <footer className="bg-white dark:bg-gray-800 text-center py-6 mt-10 border-t dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} <span className="text-blue-600">DriveMatch</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
