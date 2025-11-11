import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

/* ==========================================================
   🧠 POST /api/compare/ai-verdict
   Generate server-side verdict summary
   ========================================================== */
router.post("/ai-verdict", async (req, res) => {
  try {
    const { vehicles } = req.body;
    if (!vehicles || vehicles.length < 2)
      return res.status(400).json({ message: "Need at least two vehicles." });

    // Fetch latest vehicle data for accuracy
    const ids = vehicles.map((v) => v._id);
    const full = await Vehicle.find({ _id: { $in: ids } });

    // Normalize
    const parsed = full.map((v) => ({
      id: v._id,
      name: v.name,
      brand: v.brand,
      price: v.price,
      mileage: parseFloat(v.mileage) || 0,
      perf: v.performanceScore || 0,
    }));

    const maxMile = Math.max(...parsed.map((p) => p.mileage));
    const maxPerf = Math.max(...parsed.map((p) => p.perf));
    const minPrice = Math.min(...parsed.map((p) => p.price));

    parsed.forEach((v) => {
      const normMile = maxMile ? v.mileage / maxMile : 0;
      const normPerf = maxPerf ? v.perf / maxPerf : 0;
      const normPrice = minPrice ? minPrice / v.price : 0;
      v.totalScore = normMile * 0.4 + normPerf * 0.4 + normPrice * 0.2;
    });

    const best = parsed.reduce((a, b) => (b.totalScore > a.totalScore ? b : a), parsed[0]);

    // 🗣️ Natural verdict
    const verdict = `💬 Overall, ${best.name} from ${best.brand} emerges as the most balanced choice, offering impressive performance and efficiency for its price segment.`;

    res.json({
      verdict,
      winnerId: best.id,
      scores: parsed.map(({ id, name, totalScore }) => ({ id, name, totalScore })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
