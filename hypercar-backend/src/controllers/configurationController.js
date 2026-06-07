const Configuration = require('../models/Configuration');
const Car = require('../models/Car');

// POST /api/configurations - create a new configuration
exports.createConfiguration = async (req, res) => {
  try {
    const { carId, selectedOptions, customerInfo, notes } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

    // Calculate total price
    let totalPrice = car.basePrice;
    const opts = selectedOptions || {};

    if (opts.color?.price) totalPrice += opts.color.price;
    if (opts.interior?.price) totalPrice += opts.interior.price;
    if (opts.wheels?.price) totalPrice += opts.wheels.price;
    if (opts.packages?.length) {
      totalPrice += opts.packages.reduce((sum, p) => sum + (p.price || 0), 0);
    }

    const config = await Configuration.create({
      car: carId,
      selectedOptions: opts,
      customerInfo: customerInfo || {},
      totalPrice,
      notes,
      status: 'saved',
    });

    await config.populate('car', 'brand model year basePrice image specs');

    res.status(201).json({ success: true, data: config });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/configurations/:configId - retrieve a saved config by UUID
exports.getConfiguration = async (req, res) => {
  try {
    const config = await Configuration.findOne({ configId: req.params.configId }).populate(
      'car',
      'brand model year basePrice image specs'
    );
    if (!config) return res.status(404).json({ success: false, message: 'Configuration not found' });
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/configurations/:configId - update an existing configuration
exports.updateConfiguration = async (req, res) => {
  try {
    const { selectedOptions, customerInfo, notes } = req.body;

    const config = await Configuration.findOne({ configId: req.params.configId }).populate('car');
    if (!config) return res.status(404).json({ success: false, message: 'Configuration not found' });

    if (selectedOptions) config.selectedOptions = selectedOptions;
    if (customerInfo) config.customerInfo = customerInfo;
    if (notes !== undefined) config.notes = notes;

    // Recalculate price
    let totalPrice = config.car.basePrice;
    const opts = config.selectedOptions;
    if (opts.color?.price) totalPrice += opts.color.price;
    if (opts.interior?.price) totalPrice += opts.interior.price;
    if (opts.wheels?.price) totalPrice += opts.wheels.price;
    if (opts.packages?.length) {
      totalPrice += opts.packages.reduce((sum, p) => sum + (p.price || 0), 0);
    }
    config.totalPrice = totalPrice;

    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/configurations/:configId/submit - submit for ordering
exports.submitConfiguration = async (req, res) => {
  try {
    const config = await Configuration.findOne({ configId: req.params.configId });
    if (!config) return res.status(404).json({ success: false, message: 'Configuration not found' });

    if (!config.customerInfo?.name || !config.customerInfo?.email) {
      return res.status(400).json({ success: false, message: 'Customer name and email are required to submit' });
    }

    config.status = 'submitted';
    await config.save();

    res.json({
      success: true,
      message: 'Configuration submitted successfully! Our team will contact you shortly.',
      data: { configId: config.configId, status: config.status, totalPrice: config.totalPrice },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/configurations/price-summary - live price preview (no DB write)
exports.getPriceSummary = async (req, res) => {
  try {
    const { carId, selectedOptions } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

    let totalPrice = car.basePrice;
    const breakdown = [{ label: `${car.brand} ${car.model} (Base)`, price: car.basePrice }];
    const opts = selectedOptions || {};

    if (opts.color?.price) {
      totalPrice += opts.color.price;
      breakdown.push({ label: `Color: ${opts.color.name}`, price: opts.color.price });
    }
    if (opts.interior?.price) {
      totalPrice += opts.interior.price;
      breakdown.push({ label: `Interior: ${opts.interior.name}`, price: opts.interior.price });
    }
    if (opts.wheels?.price) {
      totalPrice += opts.wheels.price;
      breakdown.push({ label: `Wheels: ${opts.wheels.name}`, price: opts.wheels.price });
    }
    if (opts.packages?.length) {
      opts.packages.forEach((p) => {
        totalPrice += p.price || 0;
        breakdown.push({ label: `Package: ${p.name}`, price: p.price });
      });
    }

    res.json({ success: true, data: { totalPrice, breakdown } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/configurations - list all (admin)
exports.getAllConfigurations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const configs = await Configuration.find(filter)
      .populate('car', 'brand model year')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Configuration.countDocuments(filter);
    res.json({ success: true, total, page: Number(page), data: configs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
