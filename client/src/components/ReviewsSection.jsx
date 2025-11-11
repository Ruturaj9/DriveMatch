import { useEffect, useState } from "react";
import axios from "axios";

const ReviewsSection = ({ vehicleId }) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${vehicleId}`);
      if (res.data.reviews) {
        setReviews(res.data.reviews);
        setAvgRating(res.data.avgRating);
      } else {
        setReviews([]);
        setAvgRating(0);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [vehicleId]);

  // 🔹 Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/reviews", {
        vehicleId,
        name: name || "Anonymous",
        rating,
        comment,
      });
      setName("");
      setRating(0);
      setComment("");
      fetchReviews(); // refresh after post
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
        ⭐ Reviews & Ratings
      </h2>

      {/* Average Rating */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
      ) : (
        <div className="mb-4">
          <p className="text-yellow-500 text-lg font-bold">
            Average Rating: {avgRating} / 5
          </p>
          <ul className="space-y-3 mt-3">
            {reviews.map((r) => (
              <li
                key={r._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {r.name}
                  </span>
                  <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {r.comment}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Review Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
      >
        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
          Leave a Review
        </h3>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="0">Select Rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} ★
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border rounded-lg px-3 py-2 h-24 resize-none dark:bg-gray-800 dark:border-gray-700"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewsSection;
