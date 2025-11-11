import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#e11d48", "#a855f7"];

const Insights = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vehicles");
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // 🧠 Derived analytics (memoized for performance)
  const { avgPriceByBrand, fuelDist, topPerformance, totalVehicles, overallAvgPrice, mostCommonFuel } =
    useMemo(() => {
      if (!vehicles.length) return {};

      const avgPriceByBrand = Object.values(
        vehicles.reduce((acc, v) => {
          if (!v.brand || !v.price) return acc;
          if (!acc[v.brand]) acc[v.brand] = { brand: v.brand, total: 0, count: 0 };
          acc[v.brand].total += v.price;
          acc[v.brand].count++;
          return acc;
        }, {})
      )
        .map((b) => ({
          brand: b.brand,
          avgPrice: Math.round(b.total / b.count),
        }))
        .sort((a, b) => b.avgPrice - a.avgPrice)
        .slice(0, 8);

      const fuelDist = Object.values(
        vehicles.reduce((acc, v) => {
          if (!v.fuelType) return acc;
          acc[v.fuelType] = acc[v.fuelType] || { fuel: v.fuelType, count: 0 };
          acc[v.fuelType].count++;
          return acc;
        }, {})
      );

      const topPerformance = [...vehicles]
        .filter((v) => v.performanceScore)
        .sort((a, b) => b.performanceScore - a.performanceScore)
        .slice(0, 8)
        .map((v) => ({
          name: v.name,
          performance: v.performanceScore,
        }));

      const totalVehicles = vehicles.length;
      const overallAvgPrice = Math.round(
        vehicles.reduce((acc, v) => acc + (v.price || 0), 0) / totalVehicles
      );

      const mostCommonFuel =
        fuelDist.sort((a, b) => b.count - a.count)[0]?.fuel || "N/A";

      return { avgPriceByBrand, fuelDist, topPerformance, totalVehicles, overallAvgPrice, mostCommonFuel };
    }, [vehicles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading Insights...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10 transition-colors">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          📊 Vehicle Insights Dashboard
        </h1>

        {/* 🔹 Summary Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 text-center">
            <p className="text-gray-500 dark:text-gray-400">Total Vehicles</p>
            <h3 className="text-2xl font-bold text-blue-600">{totalVehicles}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 text-center">
            <p className="text-gray-500 dark:text-gray-400">Average Price</p>
            <h3 className="text-2xl font-bold text-green-600">
              ₹{overallAvgPrice.toLocaleString()}
            </h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 text-center">
            <p className="text-gray-500 dark:text-gray-400">Most Common Fuel</p>
            <h3 className="text-2xl font-bold text-orange-500">{mostCommonFuel}</h3>
          </div>
        </div>

        {/* 💰 Average Price by Brand */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            💰 Average Price by Brand
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgPriceByBrand}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="brand" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: "10px" }}
                cursor={{ fill: "rgba(59,130,246,0.1)" }}
              />
              <Bar dataKey="avgPrice" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ⛽ Fuel Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            ⛽ Fuel Type Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fuelDist}
                dataKey="count"
                nameKey="fuel"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {fuelDist.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: "10px" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🏎️ Top Performance Vehicles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            🏎️ Top Performance Vehicles
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: "10px" }}
              />
              <Bar dataKey="performance" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Insights;
