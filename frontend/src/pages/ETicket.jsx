import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ETicket.css";

const ETicket = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data } = await axios.get(`/api/bookings/detail/${bookingId}`);
      setBooking(data);
    } catch (err) {
      toast.error("Booking not found");
      navigate("/my-bookings");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handlePrint = () => window.print();

  if (loading) return <div className="loading">Loading your ticket...</div>;
  if (!booking) return null;

  const f = booking.flightId;

  return (
    <div className="ticket-page">
      <div className="ticket-actions no-print">
        <button className="btn btn-outline" onClick={() => navigate("/my-bookings")}>
          ← My Bookings
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          🖨️ Print Ticket
        </button>
      </div>

      <div className="ticket">
        {/* Header */}
        <div className="ticket-header">
          <div className="ticket-logo">✈️ SkyBook</div>
          <div className="ticket-title">
            <div>Boarding Pass / E-Ticket</div>
            <div className="ticket-status">
              <span
                className={`badge ${
                  booking.bookingStatus === "Confirmed"
                    ? "badge-green"
                    : "badge-red"
                }`}
              >
                {booking.bookingStatus}
              </span>
            </div>
          </div>
          <div className="ticket-pnr">
            <div>PNR</div>
            <strong>{booking.pnrNumber}</strong>
          </div>
        </div>

        {/* Route */}
        <div className="ticket-route">
          <div className="ticket-city">
            <div className="t-code">{f.from.code}</div>
            <div className="t-city">{f.from.city}</div>
            <div className="t-time">{formatTime(f.departureTime)}</div>
          </div>
          <div className="ticket-path">
            <div className="t-airline">{f.airline}</div>
            <div className="t-line">──────✈──────</div>
            <div className="t-flight">{f.flightNumber}</div>
          </div>
          <div className="ticket-city" style={{ textAlign: "right" }}>
            <div className="t-code">{f.to.code}</div>
            <div className="t-city">{f.to.city}</div>
            <div className="t-time">{formatTime(f.arrivalTime)}</div>
          </div>
        </div>

        {/* Date Row */}
        <div className="ticket-date-row">
          <span>📅 {formatDate(f.departureTime)}</span>
          <span>⏱️ Duration: {f.duration}</span>
          <span>💺 Class: {booking.seatClass.charAt(0).toUpperCase() + booking.seatClass.slice(1)}</span>
        </div>

        {/* Divider */}
        <div className="ticket-divider">
          <div className="notch left"></div>
          <div className="dashed-line"></div>
          <div className="notch right"></div>
        </div>

        {/* Passengers */}
        <div className="ticket-section">
          <h4>Passengers ({booking.passengers.length})</h4>
          <table className="passenger-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {booking.passengers.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.passportNumber || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contact & Price */}
        <div className="ticket-footer-grid">
          <div className="ticket-section">
            <h4>Contact Details</h4>
            <p>📧 {booking.contactEmail}</p>
            <p>📱 {booking.contactPhone}</p>
          </div>
          <div className="ticket-section ticket-price-block">
            <h4>Total Fare</h4>
            <div className="t-total">₹{booking.totalPrice.toLocaleString()}</div>
            <div className="t-per-person">
              ₹{(booking.totalPrice / booking.passengers.length).toLocaleString()} per person
            </div>
          </div>
        </div>

        <div className="ticket-note">
          Please carry a valid government photo ID at the time of boarding.
          Report to the airport at least 2 hours before departure.
        </div>
      </div>
    </div>
  );
};

export default ETicket;
