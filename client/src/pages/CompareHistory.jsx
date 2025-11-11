import { useEffect, useState } from "react";
import axios from "axios";

const CompareHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/compare/history/guest")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">📜 Compare History</h1>
      {history.length === 0 ? (
        <p>No saved comparisons yet.</p>
      ) : (
        history.map((h) => (
          <div
            key={h._id}
            className="border border-gray-200 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800"
          >
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
              Room {h.roomNumber}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Verdict: {h.verdict}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(h.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default CompareHistory;
