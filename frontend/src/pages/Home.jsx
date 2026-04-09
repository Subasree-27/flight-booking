import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const CITIES = [
  { code: "DEL", name: "Delhi" },
  { code: "BOM", name: "Mumbai" },
  { code: "BLR", name: "Bangalore" },
  { code: "MAA", name: "Chennai" },
  { code: "HYD", name: "Hyderabad" },
  { code: "CCU", name: "Kolkata" },
];

const Home = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    from: "",
    to: "",
    date: today,
    seatClass: "economy",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(form).toString();
    navigate(`/search?${params}`);
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Fly Anywhere, Anytime</h1>
          <p>Search and book flights across India at the best prices</p>

          <form className="search-box card" onSubmit={handleSearch}>
            <div className="search-grid">
              <div className="form-group">
                <label>From</label>
                <select
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  required
                >
                  <option value="">Select City</option>
                  {CITIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="swap-icon">⇄</div>

              <div className="form-group">
                <label>To</label>
                <select
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  required
                >
                  <option value="">Select City</option>
                  {CITIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  min={today}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Class</label>
                <select
                  value={form.seatClass}
                  onChange={(e) =>
                    setForm({ ...form, seatClass: e.target.value })
                  }
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary search-btn">
              🔍 Search Flights
            </button>
          </form>
        </div>
      </div>

      {/* Features */}
      <div className="features container">
        <h2>Why SkyBook?</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">💸</div>
            <h3>Best Prices</h3>
            <p>Compare prices across all major airlines instantly</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Booking</h3>
            <p>Book tickets in under 2 minutes with our streamlined process</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🎫</div>
            <h3>E-Ticket</h3>
            <p>Get your e-ticket instantly after booking confirmation</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>Your data and transactions are always protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
