import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

// POST: Add new vehicle
router.post("/", async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all vehicles (with filters)
router.get("/", async (req, res) => {
  try {
    const { name, brand, minPrice, maxPrice, type } = req.query;

    // Base filter object
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // case-insensitive match
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }

    if (type) {
      filter.type = type; // 'car' or 'bike'
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(filter);
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//for trending vehicles
router.get("/trending", async (req, res) => {
  try {
    const trendingVehicles = await Vehicle.find({ isTrending: true }).limit(10);
    res.json(trendingVehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Similar vehicles by ID
router.get("/similar/:id", async (req, res) => {
  try {
    const baseVehicle = await Vehicle.findById(req.params.id);
    if (!baseVehicle)
      return res.status(404).json({ message: "Vehicle not found" });

    // Find vehicles with same type & within ±20% price range
    const minPrice = baseVehicle.price * 0.8;
    const maxPrice = baseVehicle.price * 1.2;

    const similar = await Vehicle.find({
      _id: { $ne: baseVehicle._id },
      type: baseVehicle.type,
      price: { $gte: minPrice, $lte: maxPrice },
    }).limit(3);

    res.json(similar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
