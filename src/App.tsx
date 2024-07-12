import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { AuthenticateProvider } from "./contexts/AuthenticateContext";
import { FilmDetail } from "./pages/FilmDetail";
import { HomeContent } from "./pages/HomeContent";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminChecking } from "./components/AdminChecking";
import { ManageUser } from "./pages/ManageUser";
import { ManageFilm } from "./pages/ManageFilm";
import { ManageCategory } from "./pages/ManageCategory";
import { ManageShow } from "./pages/ManageShow";
import { Booking } from "./pages/Booking";
import { UserChecking } from "./components/UserChecking";
import { BookingProvider } from "./contexts/BookingContext";
import { Payment } from "./pages/Payment";
import { TicketView } from "./pages/TicketView";
import { ManageTicket } from "./pages/ManageTicket";

export const App = () => {
    return (
        <BrowserRouter>
            <AuthenticateProvider>
                <BookingProvider>
                    <Routes>
                        <Route path="/" element={<Home />}>
                            <Route index element={<HomeContent />} />
                            <Route path="/filmdetail/:id" element={<FilmDetail />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route
                                path="/booking"
                                element={
                                    <UserChecking>
                                        <Booking />
                                    </UserChecking>
                                }
                            />
                            <Route
                                path="/payment"
                                element={
                                    <UserChecking>
                                        <Payment />
                                    </UserChecking>
                                }
                            />
                            <Route
                                path="/ticket"
                                element={
                                    <UserChecking>
                                        <TicketView />
                                    </UserChecking>
                                }
                            />
                        </Route>
                        <Route
                            path="/manage"
                            element={
                                <AdminChecking>
                                    <Home />
                                </AdminChecking>
                            }
                        >
                            <Route index element={<HomeContent />} />
                            <Route path="user" element={<ManageUser />} />
                            <Route path="film" element={<ManageFilm />} />
                            <Route path="category" element={<ManageCategory />} />
                            <Route path="show" element={<ManageShow />} />
                            <Route path="ticket" element={<ManageTicket />} />
                        </Route>
                    </Routes>
                </BookingProvider>
            </AuthenticateProvider>
        </BrowserRouter>
    );
};
