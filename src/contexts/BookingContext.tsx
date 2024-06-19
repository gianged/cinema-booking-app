import React, {
  createContext,
  useState,
  useRef,
  MutableRefObject,
  SetStateAction,
  ReactElement,
  useEffect,
} from "react";
import { useCookies } from "react-cookie";

interface BookingContextType {
  filmId: MutableRefObject<number | undefined>;
  showId: MutableRefObject<number | undefined>;
  showPrice: number;
  setShowPrice: React.Dispatch<SetStateAction<number>>;
  ticketAmount: number;
  setTicketAmount: React.Dispatch<SetStateAction<number>>;
  setData: (filmId: number, showId: number, showPrice: number) => void;
  setSeatAmount: (ticketAmount: number) => void;
  removeData: () => void;
}

export const BookingContext = createContext<BookingContextType>({
  filmId: { current: undefined },
  showId: { current: undefined },
  showPrice: 0,
  setShowPrice: () => {},
  ticketAmount: 0,
  setTicketAmount: () => {},
  setSeatAmount: () => {},
  setData: () => {},
  removeData: () => {},
});

export const BookingProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const filmId = useRef<number | undefined>(undefined);
  const showId = useRef<number | undefined>(undefined);
  const [showPrice, setShowPrice] = useState<number>(0);
  const [ticketAmount, setTicketAmount] = useState<number>(0);
  const [bookingDataCookies, setBookingDataCookies, removeBookingDataCookies] = useCookies([
    "bookingData",
  ]);

  useEffect(() => {
    if (bookingDataCookies.bookingData) {
      filmId.current = bookingDataCookies.bookingData.filmId;
      showId.current = bookingDataCookies.bookingData.showId;
      setShowPrice(bookingDataCookies.bookingData.showPrice);
      setTicketAmount(bookingDataCookies.bookingData.ticketAmount);
    }
  }, [bookingDataCookies.bookingData]);

  const setData = (filmId: number, showId: number, showPrice: number) => {
    const existingData = bookingDataCookies.bookingData || {};
    const newData = { ...existingData, filmId, showId, showPrice };
    setBookingDataCookies("bookingData", newData);
  };

  const setSeatAmount = (ticketAmount: number) => {
    const existingData = bookingDataCookies.bookingData || {};
    const newData = { ...existingData, ticketAmount };
    setBookingDataCookies("bookingData", newData);
  };

  const removeData = () => {
    removeBookingDataCookies("bookingData");
  };

  return (
    <BookingContext.Provider
      value={{
        filmId,
        showId,
        showPrice,
        setShowPrice,
        setData,
        removeData,
        setSeatAmount,
        ticketAmount,
        setTicketAmount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
