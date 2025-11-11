import { useContext, useMemo } from "react";
import { CompareContext } from "../context/compareContext";
import {
  Car,
  TrendingUp,
  Fuel,
  Zap,
  Settings,
  DollarSign,
  Trophy,
  MessageSquareText,
} from "lucide-react";

const parseNumber = (val) => {
  if (val == null) return NaN;
  if (typeof val === "number") return val;
  const s = String(val).replace(/[, ]+/g, "").match(/[\d.]+/);
  return s ? parseFloat(s[0]) : NaN;
};

const Compare = () => {
  const { rooms, removeVehicleFromRoom, clearRoom } = useContext(CompareContext);

  const handleImageError = (e) => (e.target.src = "/placeholder.jpg");

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className =
      "fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-out z-[9999]";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const getHighlightClass = (vehicles, key, lowerIsBetter = false) => {
    const nums = vehicles.map((v) => parseNumber(v[key]));
    const valid = nums.filter(Number.isFinite);
    if (!valid.length) return () => "";
    const best = lowerIsBetter ? Math.min(...valid) : Math.max(...valid);
    return (val) => {
      const n = parseNumber(val);
      return n === best ? "text-green-500 font-semibold" : "";
    };
  };

  // 🔹 Room analysis with summary, winners, and AI-style verdict
  const analyzeRoom = (vehicles) => {
    const parsed = vehicles.map((v) => ({
      id: v._id,
      name: v.name,
      price: parseNumber(v.price),
      mileage: parseNumber(v.mileage),
      perf: parseNumber(v.performanceScore),
    }));

    const getBest = (key, lowerIsBetter = false) => {
      const vals = parsed.filter((p) => Number.isFinite(p[key]));
      if (!vals.length) return null;
      return lowerIsBetter
        ? vals.reduce((a, b) => (a[key] < b[key] ? a : b))
        : vals.reduce((a, b) => (a[key] > b[key] ? a : b));
    };

    const cheapest = getBest("price", true);
    const bestMileage = getBest("mileage");
    const bestPerf = getBest("perf");

    // 🧮 Overall scoring (normalized)
    const maxMile = Math.max(...parsed.map((p) => p.mileage || 0));
    const maxPerf = Math.max(...parsed.map((p) => p.perf || 0));
    const minPrice = Math.min(...parsed.map((p) => p.price || Infinity));

    parsed.forEach((v) => {
      const normMile = maxMile ? v.mileage / maxMile : 0;
      const normPerf = maxPerf ? v.perf / maxPerf : 0;
      const normPrice = minPrice && v.price ? minPrice / v.price : 0;
      v.totalScore = normMile * 0.4 + normPerf * 0.4 + normPrice * 0.2; // weighted
    });

    const overall = parsed.reduce(
      (a, b) => (b.totalScore > a.totalScore ? b : a),
      parsed[0]
    );

    const summary = [
      cheapest && `Cheapest: ${cheapest.name}`,
      bestMileage && `Best mileage: ${bestMileage.name}`,
      bestPerf && `Best performance: ${bestPerf.name}`,
    ]
      .filter(Boolean)
      .join(" • ");

    const winners = {
      price: cheapest?.id,
      mileage: bestMileage?.id,
      performanceScore: bestPerf?.id,
    };

    // ✨ Natural verdict
    let verdict = "";
    if (overall)
      verdict = `💬 Overall, ${overall.name} offers the best overall balance of price, mileage, and performance in this comparison.`;

    return { summary, winners, verdict };
  };

  const roomData = useMemo(() => {
    const out = {};
    for (const rn of Object.keys(rooms)) out[rn] = analyzeRoom(rooms[rn]);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          ⚖️ Compare Vehicles
        </h1>

        {Object.keys(rooms).map((roomNumber) => {
          const vehicles = rooms[roomNumber];
          const hasMultiple = vehicles.length > 1;
          const { summary, winners, verdict } = roomData[roomNumber] || {};

          const priceHighlight = getHighlightClass(vehicles, "price", true);
          const mileageHighlight = getHighlightClass(vehicles, "mileage");
          const perfHighlight = getHighlightClass(vehicles, "performanceScore");

          return (
            <div key={roomNumber} className="mb-12">
              {/* ── Room Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Room {roomNumber}
                  </h2>
                  {summary && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      🧠 <span className="font-medium">Quick Summary:</span>{" "}
                      {summary}
                    </p>
                  )}
                </div>

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

              {/* ── Vehicle Cards */}
              {vehicles.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed dark:border-gray-700 rounded-xl">
                  No vehicles in this room.
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
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
                          ₹{v.price?.toLocaleString() ?? "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* ── Comparison Table */}
                  {hasMultiple && (
                    <>
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
                            {/* 🏆 Winner Row */}
                            <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                              <td className="p-3 font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                                <Trophy size={16} /> Winner
                              </td>
                              {vehicles.map((v) => (
                                <td key={v._id} className="p-3 text-center">
                                  {v._id === winners?.price ||
                                  v._id === winners?.mileage ||
                                  v._id === winners?.performanceScore ? (
                                    <Trophy
                                      size={18}
                                      className="text-yellow-500 inline-block"
                                    />
                                  ) : (
                                    <span className="text-gray-400 dark:text-gray-600">
                                      —
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>

                            {/* Brand */}
                            <tr>
                              <td className="p-3 font-medium flex items-center gap-2">
                                <Car size={16} /> Brand
                              </td>
                              {vehicles.map((v) => (
                                <td key={v._id} className="p-3 text-center">
                                  {v.brand}
                                </td>
                              ))}
                            </tr>

                            {/* Price */}
                            <tr>
                              <td className="p-3 font-medium flex items-center gap-2">
                                <DollarSign size={16} /> Price
                              </td>
                              {vehicles.map((v) => (
                                <td
                                  key={v._id}
                                  className={`p-3 text-center ${priceHighlight(v.price)}`}
                                >
                                  ₹{v.price?.toLocaleString() ?? "—"}
                                </td>
                              ))}
                            </tr>

                            {/* Mileage */}
                            <tr>
                              <td className="p-3 font-medium flex items-center gap-2">
                                <Fuel size={16} /> Mileage
                              </td>
                              {vehicles.map((v) => (
                                <td
                                  key={v._id}
                                  className={`p-3 text-center ${mileageHighlight(v.mileage)}`}
                                >
                                  {v.mileage || "—"}
                                </td>
                              ))}
                            </tr>

                            {/* Performance */}
                            <tr>
                              <td className="p-3 font-medium flex items-center gap-2">
                                <Zap size={16} /> Performance
                              </td>
                              {vehicles.map((v) => (
                                <td
                                  key={v._id}
                                  className={`p-3 text-center ${perfHighlight(
                                    v.performanceScore
                                  )}`}
                                >
                                  {v.performanceScore ?? "—"}
                                </td>
                              ))}
                            </tr>

                            {/* Transmission */}
                            <tr>
                              <td className="p-3 font-medium flex items-center gap-2">
                                <Settings size={16} /> Transmission
                              </td>
                              {vehicles.map((v) => (
                                <td key={v._id} className="p-3 text-center">
                                  {v.transmission || "—"}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* 🧠 Verdict line */}
                      {verdict && (
                        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex items-start gap-3 text-sm text-blue-700 dark:text-blue-300">
                          <MessageSquareText size={18} className="mt-0.5" />
                          <span>{verdict}</span>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Toast Animation */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10%,90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out { animation: fadeInOut 2.5s ease-in-out forwards; }
      `}</style>
    </div>
  );
};

export default Compare;
