import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchFlights.css";

const SearchFlights = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState("price");

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const seatClass = searchParams.get("seatClass") || "economy";

  useEffect(() => {
    if (from && to) fetchFlights();
  }, [searchParams]);

  const fetchFlights = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await axios.get(
        `/api/flights?from=${from}&to=${to}&date=${date}&seatClass=${seatClass}`
      );
      setFlights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") return a.price[seatClass] - b.price[seatClass];
    if (sortBy === "departure")
      return new Date(a.departureTime) - new Date(b.departureTime);
    if (sortBy === "duration")
      return a.duration.localeCompare(b.duration);
    return 0;
  });

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="container">
          <h2>
            {from && to
              ? `Flights: ${from} → ${to}`
              : "Search Results"}
          </h2>
          {date && <p>{formatDate(date)} • {seatClass.charAt(0).toUpperCase() + seatClass.slice(1)} Class</p>}
        </div>
      </div>

      <div className="container search-body">
        {loading && (
          <div className="loading-msg">
            <div className="spinner"></div>
            <p>Searching flights...</p>
          </div>
        )}

        {!loading && searched && flights.length === 0 && (
          <div className="no-results card">
            <div className="no-results-icon">✈️</div>
            <h3>No flights found</h3>
            <p>Try different dates or cities</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Search Again
            </button>
          </div>
        )}

        {!loading && flights.length > 0 && (
          <>
            <div className="sort-bar">
              <span>{flights.length} flights found</span>
              <div className="sort-options">
                <label>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="price">Price</option>
                  <option value="departure">Departure Time</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            <div className="flight-list">
              {sortedFlights.map((flight) => (
                <div key={flight._id} className="flight-card card">
                  <div className="flight-airline">
                    <span className="airline-name">{flight.airline}</span>
                    <span className="flight-number">{flight.flightNumber}</span>
                    <span
                      className={`badge ${
                        flight.status === "On Time"
                          ? "badge-green"
                          : flight.status === "Delayed"
                          ? "badge-yellow"
                          : "badge-red"
                      }`}
                    >
                      {flight.status}
                    </span>
                  </div>

                  <div className="flight-route">
                    <div className="flight-time-block">
                      <div className="time">{formatTime(flight.departureTime)}</div>
                      <div className="city-code">{flight.from.code}</div>
                      <div className="city-name">{flight.from.city}</div>
                    </div>

                    <div className="flight-path">
                      <div className="duration">{flight.duration}</div>
                      <div className="line">──────✈──────</div>
                    </div>

                    <div className="flight-time-block">
                      <div className="time">{formatTime(flight.arrivalTime)}</div>
                      <div className="city-code">{flight.to.code}</div>
                      <div className="city-name">{flight.to.city}</div>
                    </div>
                  </div>

                  <div className="flight-footer">
                    <div className="seats-info">
                      <span>💺 {flight.seats[seatClass]} seats left</span>
                    </div>
                    <div className="price-book">
                      <div className="price">
                        ₹{flight.price[seatClass].toLocaleString()}
                        <span>/person</span>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          navigate(`/book/${flight._id}?class=${seatClass}`)
                        }
                        disabled={flight.seats[seatClass] === 0}
                      >
                        {flight.seats[seatClass] === 0
                          ? "Sold Out"
                          : "Book Now"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchFlights;
