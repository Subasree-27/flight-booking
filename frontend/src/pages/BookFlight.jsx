import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./BookFlight.css";

const emptyPassenger = { name: "", age: "", gender: "Male", passportNumber: "" };

const BookFlight = () => {
  const { flightId } = useParams();
  const [searchParams] = useSearchParams();
  const seatClass = searchParams.get("class") || "economy";
  const navigate = useNavigate();
  const { user } = useAuth();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([{ ...emptyPassenger }]);
  const [contact, setContact] = useState({
    email: user?.email || "",
    phone: "",
  });

  useEffect(() => {
    fetchFlight();
  }, [flightId]);

  const fetchFlight = async () => {
    try {
      const { data } = await axios.get(`/api/flights/${flightId}`);
      setFlight(data);
    } catch (err) {
      toast.error("Flight not found");
      navigate("/search");
    } finally {
      setLoading(false);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleCountChange = (count) => {
    setPassengerCount(count);
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(passengers[i] || { ...emptyPassenger });
    }
    setPassengers(list);
  };

  const handleBook = async () => {
    if (!contact.phone || contact.phone.length < 10) {
      return toast.error("Enter a valid phone number");
    }

    setBooking(true);
    try {
      const { data } = await axios.post("/api/bookings", {
        flightId,
        passengers,
        seatClass,
        contactEmail: contact.email,
        contactPhone: contact.phone,
      });
      toast.success("Booking confirmed! 🎉");
      navigate(`/ticket/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  if (loading) return <div className="loading">Loading flight details...</div>;
  if (!flight) return null;

  const totalPrice = flight.price[seatClass] * passengerCount;

  return (
    <div className="book-page">
      <div className="container book-container">
        {/* Flight Summary */}
        <div className="card flight-summary">
          <h3>Flight Summary</h3>
          <div className="summary-route">
            <div>
              <div className="sum-time">{formatTime(flight.departureTime)}</div>
              <div className="sum-city">{flight.from.city} ({flight.from.code})</div>
              <div className="sum-date">{formatDate(flight.departureTime)}</div>
            </div>
            <div className="sum-arrow">→ {flight.duration} →</div>
            <div>
              <div className="sum-time">{formatTime(flight.arrivalTime)}</div>
              <div className="sum-city">{flight.to.city} ({flight.to.code})</div>
              <div className="sum-date">{formatDate(flight.arrivalTime)}</div>
            </div>
          </div>
          <div className="summary-meta">
            <span>✈️ {flight.airline} • {flight.flightNumber}</span>
            <span className={`badge ${seatClass === "business" ? "badge-purple" : "badge-blue"}`}>
              {seatClass.charAt(0).toUpperCase() + seatClass.slice(1)}
            </span>
          </div>
        </div>

        <div className="book-body">
          {/* Passenger Count */}
          <div className="card">
            <h3>Number of Passengers</h3>
            <div className="passenger-count-row">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  className={`count-btn ${passengerCount === n ? "active" : ""}`}
                  onClick={() => handleCountChange(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Passenger Details */}
          {passengers.map((p, i) => (
            <div className="card" key={i}>
              <h3>Passenger {i + 1}</h3>
              <div className="passenger-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="As on ID proof"
                    value={p.name}
                    onChange={(e) =>
                      handlePassengerChange(i, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    placeholder="Age"
                    min="1"
                    max="120"
                    value={p.age}
                    onChange={(e) =>
                      handlePassengerChange(i, "age", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={p.gender}
                    onChange={(e) =>
                      handlePassengerChange(i, "gender", e.target.value)
                    }
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Passport / ID (optional)</label>
                  <input
                    type="text"
                    placeholder="Passport or Aadhaar number"
                    value={p.passportNumber}
                    onChange={(e) =>
                      handlePassengerChange(i, "passportNumber", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Contact Details */}
          <div className="card">
            <h3>Contact Details</h3>
            <div className="passenger-grid">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact({ ...contact, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Price Summary + Confirm */}
          <div className="card price-summary">
            <div className="price-row">
              <span>
                ₹{flight.price[seatClass].toLocaleString()} × {passengerCount} passenger
                {passengerCount > 1 ? "s" : ""}
              </span>
              <strong>₹{totalPrice.toLocaleString()}</strong>
            </div>
            <button
              className="btn btn-primary confirm-btn"
              onClick={handleBook}
              disabled={booking}
            >
              {booking ? "Processing..." : `Confirm Booking • ₹${totalPrice.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFlight;
