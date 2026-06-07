# 🏎️ Hypercar Configurator — Backend API

Node.js + Express + MongoDB REST API for the hypercar configurator frontend.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and settings
```

### 3. Seed the database (optional but recommended)
```bash
npm run seed
# Adds Lamborghini Revuelto, Ferrari SF90, and Bugatti Chiron sample data
```

### 4. Start the server
```bash
npm run dev      # development (nodemon)
npm start        # production
```

Server starts at: `http://localhost:5000`

---

## 📡 API Endpoints

### 🚗 Cars

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/api/cars`      | List all active cars     |
| GET    | `/api/cars/:id`  | Get car + all options    |
| POST   | `/api/cars`      | Create a car (admin)     |
| PUT    | `/api/cars/:id`  | Update a car (admin)     |
| DELETE | `/api/cars/:id`  | Soft-delete a car        |

### ⚙️ Configurations

| Method | Endpoint                              | Description                  |
|--------|---------------------------------------|------------------------------|
| POST   | `/api/configurations`                 | Save a new configuration     |
| GET    | `/api/configurations/:configId`       | Load a saved configuration   |
| PUT    | `/api/configurations/:configId`       | Update a configuration       |
| POST   | `/api/configurations/:configId/submit`| Submit for ordering          |
| POST   | `/api/configurations/price-summary`   | Live price calculation       |
| GET    | `/api/configurations`                 | List all configs (admin)     |

### ❤️ Health
| Method | Endpoint   | Description  |
|--------|------------|--------------|
| GET    | `/health`  | Server check |

---

## 📦 Example Requests

### Save a Configuration
```json
POST /api/configurations
{
  "carId": "<mongo_car_id>",
  "customerInfo": {
    "name": "Alex Ray",
    "email": "alex@example.com",
    "phone": "+91 98765 43210"
  },
  "selectedOptions": {
    "color": { "name": "Verde Mantis", "hex": "#9BBF30", "price": 0 },
    "interior": { "name": "Bianco Leda", "material": "Full Leather", "price": 8000 },
    "wheels": { "name": "Oro Elios", "size": "21\"/22\"", "price": 9500 },
    "packages": [
      { "name": "Carbon Aero Pack", "price": 35000 }
    ]
  }
}
```

### Live Price Summary
```json
POST /api/configurations/price-summary
{
  "carId": "<mongo_car_id>",
  "selectedOptions": { ... }
}
```
Response:
```json
{
  "success": true,
  "data": {
    "totalPrice": 652500,
    "breakdown": [
      { "label": "Lamborghini Revuelto (Base)", "price": 600000 },
      { "label": "Interior: Bianco Leda", "price": 8000 },
      { "label": "Wheels: Oro Elios", "price": 9500 },
      { "label": "Package: Carbon Aero Pack", "price": 35000 }
    ]
  }
}
```

---

## 🧱 Project Structure

```
hypercar-backend/
├── server.js                    # Entry point
├── seed.js                      # DB seeder (3 sample cars)
├── .env.example
├── src/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── Car.js               # Car schema
│   │   └── Configuration.js     # User config schema
│   ├── controllers/
│   │   ├── carController.js
│   │   └── configurationController.js
│   ├── routes/
│   │   ├── cars.js
│   │   └── configurations.js
│   └── middleware/
│       └── errorHandler.js
```

---

## 🔗 Connecting your Frontend

```js
// Example fetch from your React/Vue frontend
const BASE_URL = 'http://localhost:5000/api';

// Get all cars
const cars = await fetch(`${BASE_URL}/cars`).then(r => r.json());

// Save config
const saved = await fetch(`${BASE_URL}/configurations`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ carId, selectedOptions, customerInfo })
}).then(r => r.json());

// Share link using configId
// e.g. https://yourapp.com/config/saved.data.configId
```
