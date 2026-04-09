import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/my");
      setBookings(data);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.delete(`/api/bookings/${id}`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed");
    }
  };

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) return <div className="loading">Loading your bookings...</div>;

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div className="container">
          <h2>My Bookings</h2>
          <p>{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      <div className="container bookings-body">
        {bookings.length === 0 ? (
          <div className="no-bookings card">
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎫</div>
            <h3>No bookings yet</h3>
            <p>Book your first flight today!</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/")}
              style={{ marginTop: "16px" }}
            >
              Search Flights
            </button>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="booking-card card">
              <div className="booking-top">
                <div className="booking-pnr">
                  PNR: <strong>{b.pnrNumber}</strong>
                </div>
                <span
                  className={`badge ${
                    b.bookingStatus === "Confirmed"
                      ? "badge-green"
                      : b.bookingStatus === "Cancelled"
                      ? "badge-red"
                      : "badge-yellow"
                  }`}
                >
                  {b.bookingStatus}
                </span>
              </div>

              <div className="booking-route">
                <div>
                  <div className="b-time">{formatTime(b.flightId.departureTime)}</div>
                  <div className="b-city">{b.flightId.from.city} ({b.flightId.from.code})</div>
                </div>
                <div className="b-arrow">✈️ {b.flightId.duration}</div>
                <div>
                  <div className="b-time">{formatTime(b.flightId.arrivalTime)}</div>
                  <div className="b-city">{b.flightId.to.city} ({b.flightId.to.code})</div>
                </div>
              </div>

              <div className="booking-meta">
                <span>📅 {formatDate(b.flightId.departureTime)}</span>
                <span>👥 {b.passengers.length} passenger{b.passengers.length > 1 ? "s" : ""}</span>
                <span>💺 {b.seatClass.charAt(0).toUpperCase() + b.seatClass.slice(1)}</span>
                <span>💰 ₹{b.totalPrice.toLocaleString()}</span>
              </div>

              <div className="booking-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/ticket/${b._id}`)}
                >
                  View E-Ticket
                </button>
                {b.bookingStatus === "Confirmed" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(b._id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
