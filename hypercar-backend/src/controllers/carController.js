const Car = require('../models/Car');

// GET /api/cars - list all active cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ isActive: true }).select('-__v');
    res.json({ success: true, count: cars.length, data: cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/cars/:id - get single car with all options
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).select('-__v');
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, data: car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cars - create a car (admin)
exports.createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, data: car });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/cars/:id - update a car (admin)
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, data: car });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/cars/:id - soft delete (admin)
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, message: 'Car deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
