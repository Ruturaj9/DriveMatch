import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CompareContext } from "../context/compareContext";
import ReviewsSection from "../components/ReviewsSection";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(1);
  const { addVehicleToRoom } = useContext(CompareContext);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const [vehicleRes, similarRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/vehicles/${id}`),
          axios.get(`http://localhost:5000/api/vehicles/similar/${id}`),
        ]);
        setVehicle(vehicleRes.data);
        setSimilar(similarRes.data?.similar || []);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleAddToCompare = () => {
    if (!vehicle) return;
    addVehicleToRoom(selectedRoom, vehicle);

    // 🧠 Replace browser alert with small non-blocking toast
    const toast = document.createElement("div");
    toast.textContent = `${vehicle.name} added to Room ${selectedRoom}`;
    toast.className =
      "fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-out";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder.jpg";
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-2/3 h-10 rounded-lg"></div>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-1/2 h-6 rounded-lg"></div>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-2/3 h-80 rounded-2xl"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-300">
        Vehicle not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* 🖼️ Image + Info Section */}
        <div className="flex flex-col md:flex-row gap-10 mb-12">
          <img
            src={vehicle.image || "/placeholder.jpg"}
            alt={vehicle.name}
            onError={handleImageError}
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

            {/* 📊 Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-800 dark:text-gray-300 mb-6">
              <p>🛠️ Engine: {vehicle.engine || "N/A"}</p>
              <p>⛽ Fuel: {vehicle.fuelType || "N/A"}</p>
              <p>⚙️ Transmission: {vehicle.transmission || "N/A"}</p>
              <p>📈 Mileage: {vehicle.mileage || "N/A"}</p>
              <p>🔥 Performance: {vehicle.performanceScore ?? "N/A"}</p>
            </div>

            {/* ⚖️ Compare Button + Room Selector */}
            <div className="mt-6 flex items-center gap-3">
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-600 text-sm"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    Room {r}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddToCompare}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
              >
                + Add to Compare
              </button>
            </div>
          </div>
        </div>

        {/* 🧩 Features Section */}
        {vehicle.features?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 grid sm:grid-cols-2 gap-x-6">
              {vehicle.features.map((feature, i) => (
                <li key={i}>{feature}</li>
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
              {similar.map((v) => (
                <div
                  key={v._id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-4 flex flex-col"
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {v.brand}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mt-1">
                    ₹{v.price?.toLocaleString()}
                  </p>
                  <Link
                    to={`/vehicle/${v._id}`}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center transition"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 🧩 Reviews Section */}
        <ReviewsSection vehicleId={vehicle._id} />
      </div>

      {/* 🔹 Simple fade-in animation for toast */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VehicleDetails;
