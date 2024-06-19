import { Button, Row } from "antd";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChair } from "@fortawesome/free-solid-svg-icons";
import "./Booking.scss";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../contexts/BookingContext";

export const Booking: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const navigate = useNavigate();
  const bookingData = useContext(BookingContext);

  const seats = Array.from({ length: 50 }, (_, i) => i + 1); // Generate 50 seats

  const toggleSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <div className="seat">
          {seats.map((seat) => (
            <Button
              key={seat}
              type={selectedSeats.includes(seat.toString()) ? "primary" : "default"}
              onClick={() => toggleSeat(seat.toString())}
              style={{ width: "60px", height: "60px", margin: "5px" }}
            >
              <FontAwesomeIcon icon={faChair} />
            </Button>
          ))}
          <Button
            className="book-button"
            type="primary"
            onClick={() => {
              bookingData.setSeatAmount(selectedSeats.length);
              navigate("/payment");
            }}
          >
            Book
          </Button>
        </div>
      </Row>
    </>
  );
};
