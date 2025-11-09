import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
      setVehicle(res.data);
      const sim = await axios.get(`http://localhost:5000/api/vehicles/similar/${id}`);
      setSimilar(sim.data.similar || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        Loading vehicle details...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        Vehicle not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* 🖼️ Main Image + Basic Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <img
            src={vehicle.image || "/placeholder.jpg"}
            alt={vehicle.name}
            className="w-full md:w-1/2 h-80 object-cover rounded-2xl shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              {vehicle.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              {vehicle.brand} | {vehicle.type?.toUpperCase()}
            </p>
            <p className="text-2xl text-green-600 font-semibold mb-4">
              ₹{vehicle.price?.toLocaleString()}
            </p>

            {/* ⚙️ Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 dark:text-gray-300">
              <p>🛠️ Engine: {vehicle.engine}</p>
              <p>⛽ Fuel: {vehicle.fuelType}</p>
              <p>⚙️ Transmission: {vehicle.transmission}</p>
              <p>📈 Mileage: {vehicle.mileage}</p>
              <p>🔥 Performance Score: {vehicle.performanceScore}</p>
            </div>

            {/* ⚖️ Compare Button */}
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">
              + Add to Compare
            </button>
          </div>
        </div>

        {/* 🧩 Features */}
        {vehicle.features?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 grid sm:grid-cols-2 gap-x-6">
              {vehicle.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 🔁 Similar Vehicles */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Compare with Similar Vehicles
          </h2>
          {similar.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No similar vehicles found.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {similar.map((s) => (
                <div
                  key={s._id}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-4 flex flex-col"
                >
                  <img
                    src={s.image || "/placeholder.jpg"}
                    alt={s.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mt-3">
                    {s.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.brand}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mt-1">
                    ₹{s.price?.toLocaleString()}
                  </p>
                  <Link
                    to={`/vehicle/${s._id}`}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-center"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
