# ✈️ SkyBook – Flight Booking System

A full-stack MERN (MongoDB, Express, React, Node.js) flight reservation web application.

## Features

- 🔐 **JWT Authentication** – Register/Login with protected routes
- ✈️ **Flight Search** – Filter by city, date, class
- 💰 **Price Comparison** – Sort by price, departure time, duration
- 👥 **Multi-Passenger Booking** – Add up to 6 passengers per booking
- 🎫 **E-Ticket** – Printable boarding pass with PNR
- ❌ **Cancel Booking** – Cancel with automatic seat restoration
- 📱 **Responsive Design** – Works on mobile and desktop

## Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 18, React Router v6, Context API, Axios |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB, Mongoose             |
| Auth      | JWT + bcryptjs                |
| UI        | Custom CSS, React Toastify    |

## Project Structure

\`\`\`
flight-booking/
├── backend/
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── flightController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Flight.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── flightRoutes.js
│   │   └── bookingRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   └── Navbar.js
        ├── context/
        │   └── AuthContext.js     # Global auth state
        ├── pages/
        │   ├── Home.js            # Search form
        │   ├── Login.js
        │   ├── Register.js
        │   ├── SearchFlights.js   # Flight results
        │   ├── BookFlight.js      # Passenger form
        │   ├── MyBookings.js      # User bookings
        │   └── ETicket.js         # Printable ticket
        ├── App.js                 # Routes
        └── index.js
\`\`\`

## API Endpoints

| Method | Route                        | Auth | Description           |
|--------|------------------------------|------|-----------------------|
| POST   | /api/auth/register           | No   | Register user         |
| POST   | /api/auth/login              | No   | Login & get JWT       |
| GET    | /api/auth/profile            | Yes  | Get current user      |
| GET    | /api/flights                 | No   | Search flights        |
| GET    | /api/flights/:id             | No   | Get flight details    |
| POST   | /api/flights/seed            | No   | Seed sample data      |
| POST   | /api/bookings                | Yes  | Book a flight         |
| GET    | /api/bookings/my             | Yes  | Get my bookings       |
| GET    | /api/bookings/detail/:id     | Yes  | Get one booking       |
| DELETE | /api/bookings/:id            | Yes  | Cancel booking        |

## Setup & Run Instructions

### Prerequisites
- Node.js v16+
- MongoDB running locally (or MongoDB Atlas URI)

### Step 1: Clone & Navigate
\`\`\`bash
git clone <your-repo-url>
cd flight-booking
\`\`\`

### Step 2: Backend Setup
\`\`\`bash
cd backend
npm install
# Edit .env if needed (MONGO_URI, JWT_SECRET)
npm run dev
\`\`\`
Backend runs on: http://localhost:5000

### Step 3: Seed Sample Flights
\`\`\`bash
curl -X POST http://localhost:5000/api/flights/seed
\`\`\`
Or open in browser: POST via Postman/Thunder Client

### Step 4: Frontend Setup
\`\`\`bash
cd ../frontend
npm install
npm start
\`\`\`
Frontend runs on: http://localhost:3000

## Usage Flow

1. Register / Login
2. Search flights from Home page
3. Select a flight → Book Now
4. Fill passenger details → Confirm
5. View E-Ticket (printable)
6. Go to My Bookings → Cancel if needed

## Environment Variables (backend/.env)

\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flightbooking
JWT_SECRET=your_super_secret_key
NODE_ENV=development
\`\`\`
