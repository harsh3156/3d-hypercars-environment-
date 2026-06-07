const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    description: { type: String },
    image: { type: String },

    specs: {
      engine: { type: String },           // e.g. "4.0L Twin-Turbo V8"
      horsepower: { type: Number },
      torque: { type: Number },           // Nm
      topSpeed: { type: Number },         // km/h
      acceleration: { type: Number },     // 0-100 km/h in seconds
      drivetrain: { type: String },       // AWD / RWD / FWD
      transmission: { type: String },     // DCT / Manual / Auto
    },

    availableOptions: {
      colors: [
        {
          name: { type: String },
          hex: { type: String },
          price: { type: Number, default: 0 },
        },
      ],
      interiors: [
        {
          name: { type: String },
          material: { type: String },
          price: { type: Number, default: 0 },
        },
      ],
      wheels: [
        {
          name: { type: String },
          size: { type: String },
          price: { type: Number, default: 0 },
        },
      ],
      packages: [
        {
          name: { type: String },
          description: { type: String },
          price: { type: Number, default: 0 },
        },
      ],
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
