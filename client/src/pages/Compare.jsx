import { useContext } from "react";
import { CompareContext } from "../context/compareContext";

const Compare = () => {
  const { rooms, removeVehicleFromRoom, clearRoom } = useContext(CompareContext);

  const handleImageError = (e) => {
    e.target.src = "/placeholder.jpg";
  };

  // 🧠 Small toast for UX feedback
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className =
      "fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-out z-[9999]";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          ⚖️ Compare Vehicles
        </h1>

        {Object.keys(rooms).map((roomNumber) => {
          const vehicles = rooms[roomNumber];
          const hasMultiple = vehicles.length > 1;

          return (
            <div key={roomNumber} className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Room {roomNumber}
                </h2>
                <button
                  onClick={() => {
                    clearRoom(roomNumber);
                    showToast(`Cleared Room ${roomNumber}`);
                  }}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  🗑 Clear Room
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed dark:border-gray-700 rounded-xl">
                  No vehicles in this room.
                </div>
              ) : (
                <>
                  {/* Vehicle Cards */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {vehicles.map((v) => (
                      <div
                        key={v._id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-4 relative hover:shadow-lg transition"
                      >
                        <button
                          onClick={() => {
                            removeVehicleFromRoom(roomNumber, v._id);
                            showToast(`Removed ${v.name}`);
                          }}
                          className="absolute top-2 right-3 text-red-500 hover:text-red-700"
                          title="Remove from room"
                        >
                          ✖
                        </button>

                        <img
                          src={v.image || "/placeholder.jpg"}
                          alt={v.name}
                          onError={handleImageError}
                          className="w-full h-40 object-cover rounded-xl mb-3"
                        />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {v.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {v.brand}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                          ₹{v.price?.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 📊 Comparison Table (if 2+ vehicles) */}
                  {hasMultiple && (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
                      <table className="w-full text-sm text-gray-800 dark:text-gray-200">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-left">
                          <tr>
                            <th className="p-3">Specification</th>
                            {vehicles.map((v) => (
                              <th key={v._id} className="p-3 text-center">
                                {v.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-3 font-medium">Brand</td>
                            {vehicles.map((v) => (
                              <td key={v._id} className="p-3 text-center">
                                {v.brand}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-medium">Price</td>
                            {vehicles.map((v) => (
                              <td key={v._id} className="p-3 text-center text-blue-500">
                                ₹{v.price?.toLocaleString()}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-medium">Engine</td>
                            {vehicles.map((v) => (
                              <td key={v._id} className="p-3 text-center">
                                {v.engine || "—"}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-medium">Mileage</td>
                            {vehicles.map((v) => (
                              <td key={v._id} className="p-3 text-center">
                                {v.mileage || "—"}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-medium">Fuel Type</td>
                            {vehicles.map((v) => (
                              <td key={v._id} className="p-3 text-center">
                                {v.fuelType || "—"}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-medium">Transmission</td>
                            {vehicles.map((v) => (
                              <td key={v._id} className="p-3 text-center">
                                {v.transmission || "—"}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-medium">Performance Score</td>
                            {vehicles.map((v) => (
                              <td key={v._id} className="p-3 text-center text-green-500 font-semibold">
                                {v.performanceScore ?? "—"}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔹 Toast Animation */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 2.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Compare;
