const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const configurationSchema = new mongoose.Schema(
  {
    configId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      index: true,
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },

    customerInfo: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },

    selectedOptions: {
      color: {
        name: { type: String },
        hex: { type: String },
        price: { type: Number, default: 0 },
      },
      interior: {
        name: { type: String },
        material: { type: String },
        price: { type: Number, default: 0 },
      },
      wheels: {
        name: { type: String },
        size: { type: String },
        price: { type: Number, default: 0 },
      },
      packages: [
        {
          name: { type: String },
          price: { type: Number, default: 0 },
        },
      ],
    },

    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ['draft', 'saved', 'submitted', 'ordered'],
      default: 'draft',
    },

    notes: { type: String },
  },
  { timestamps: true }
);

// Auto-calculate total price before saving
configurationSchema.pre('save', function (next) {
  const opts = this.selectedOptions;
  let total = 0;

  if (opts.color?.price) total += opts.color.price;
  if (opts.interior?.price) total += opts.interior.price;
  if (opts.wheels?.price) total += opts.wheels.price;
  if (opts.packages?.length) {
    total += opts.packages.reduce((sum, p) => sum + (p.price || 0), 0);
  }

  // totalPrice must include base price — set by controller
  this.totalPrice = this.totalPrice || total;
  next();
});

module.exports = mongoose.model('Configuration', configurationSchema);
