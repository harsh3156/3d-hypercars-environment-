require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('./src/models/Car');
const connectDB = require('./src/config/db');

const cars = [
  {
    brand: 'Lamborghini',
    model: 'Revuelto',
    year: 2024,
    basePrice: 600000,
    description: 'The Revuelto is a plug-in hybrid V12 supercar — Lamborghini\'s most powerful road car ever.',
    specs: {
      engine: '6.5L V12 + 3 electric motors',
      horsepower: 1001,
      torque: 725,
      topSpeed: 350,
      acceleration: 2.5,
      drivetrain: 'AWD',
      transmission: 'DCT',
    },
    availableOptions: {
      colors: [
        { name: 'Verde Mantis', hex: '#9BBF30', price: 0 },
        { name: 'Giallo Orion', hex: '#FFD700', price: 4500 },
        { name: 'Nero Aldebaran', hex: '#1A1A1A', price: 0 },
        { name: 'Rosso Mars', hex: '#C0392B', price: 4500 },
        { name: 'Blu Glauco', hex: '#2E86AB', price: 6000 },
      ],
      interiors: [
        { name: 'Nero Ade', material: 'Alcantara', price: 0 },
        { name: 'Bianco Leda', material: 'Full Leather', price: 8000 },
        { name: 'Arancio California', material: 'Alcantara + Leather', price: 12000 },
      ],
      wheels: [
        { name: 'Standard Forged', size: '20"/21"', price: 0 },
        { name: 'Oro Elios', size: '21"/22"', price: 9500 },
        { name: 'Diamond Cut Dark', size: '21"/22"', price: 11000 },
      ],
      packages: [
        { name: 'Carbon Aero Pack', description: 'Full carbon fibre body kit with active aero', price: 35000 },
        { name: 'Sensonum Audio', description: 'Premium 1200W surround sound system', price: 8000 },
        { name: 'Night Vision', description: 'Infrared camera HUD system', price: 6500 },
      ],
    },
  },
  {
    brand: 'Ferrari',
    model: 'SF90 Stradale',
    year: 2024,
    basePrice: 550000,
    description: 'Ferrari\'s flagship PHEV — 986hp, all-wheel drive, and blistering performance.',
    specs: {
      engine: '4.0L Twin-Turbo V8 + 3 electric motors',
      horsepower: 986,
      torque: 800,
      topSpeed: 340,
      acceleration: 2.5,
      drivetrain: 'AWD',
      transmission: '8-speed DCT',
    },
    availableOptions: {
      colors: [
        { name: 'Rosso Corsa', hex: '#CC0000', price: 0 },
        { name: 'Giallo Triplo Strato', hex: '#F4CA16', price: 7000 },
        { name: 'Bianco Avus', hex: '#F5F5F5', price: 0 },
        { name: 'Blu Tour de France', hex: '#003087', price: 7000 },
        { name: 'Grigio Titanio', hex: '#8D9093', price: 5000 },
      ],
      interiors: [
        { name: 'Cuoio', material: 'Full Leather', price: 0 },
        { name: 'Nero DS', material: 'Alcantara', price: 6000 },
        { name: 'Rosso Dino', material: 'Leather + Carbon', price: 14000 },
      ],
      wheels: [
        { name: '5-spoke Forged', size: '20"/21"', price: 0 },
        { name: 'Turbine Style', size: '20"/21"', price: 8500 },
        { name: 'Carbon Fibre', size: '20"/21"', price: 15000 },
      ],
      packages: [
        { name: 'Assetto Fiorano', description: 'Track-tuned suspension, titanium exhaust, carbon body', price: 45000 },
        { name: 'Panoramic Roof', description: 'Electrochromic glass roof', price: 5000 },
        { name: 'Racing Harness Kit', description: '6-point harness and roll cage prep', price: 12000 },
      ],
    },
  },
  {
    brand: 'Bugatti',
    model: 'Chiron Super Sport',
    year: 2024,
    basePrice: 3900000,
    description: 'The ultimate expression of speed and luxury — 1578hp from a quad-turbo 8.0L W16.',
    specs: {
      engine: '8.0L Quad-Turbo W16',
      horsepower: 1578,
      torque: 1600,
      topSpeed: 440,
      acceleration: 2.4,
      drivetrain: 'AWD',
      transmission: '7-speed DCT',
    },
    availableOptions: {
      colors: [
        { name: 'Nocturne Black', hex: '#1C1C1C', price: 0 },
        { name: 'French Racing Blue', hex: '#00308F', price: 0 },
        { name: 'Jet Grey', hex: '#6D7278', price: 25000 },
        { name: 'White Gold', hex: '#E8D5A3', price: 45000 },
      ],
      interiors: [
        { name: 'Beluga Black', material: 'Full Leather', price: 0 },
        { name: 'Savanna Beige', material: 'Leather + Silk', price: 20000 },
        { name: 'Sky Blue', material: 'Sky Blue Alcantara', price: 30000 },
      ],
      wheels: [
        { name: 'Polished Alloy', size: '21"/22"', price: 0 },
        { name: 'Diamond Turned', size: '21"/22"', price: 22000 },
        { name: 'Gold Plated', size: '21"/22"', price: 55000 },
      ],
      packages: [
        { name: 'Exposed Carbon Body', description: 'Full exposed carbon fibre exterior panels', price: 120000 },
        { name: 'Sky View Roof', description: 'Transparent glass roof panel', price: 35000 },
        { name: 'Bespoke Audio', description: '18-speaker custom Accuton audiophile system', price: 40000 },
      ],
    },
  },
];

const seed = async () => {
  await connectDB();
  await Car.deleteMany({});
  const inserted = await Car.insertMany(cars);
  console.log(`🌱 Seeded ${inserted.length} cars successfully`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
