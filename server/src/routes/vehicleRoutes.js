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

export default router;
