import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { AuthenticateProvider } from "./contexts/AuthenticateContext";
import { FilmDetail } from "./pages/FilmDetail";
import { HomeContent } from "./pages/HomeContent";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthenticateProvider>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<HomeContent />} />
            <Route path="/filmdetail/:id" element={<FilmDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route path="/admin" element={""}>
            {/* TODO: Add admin routes */}
          </Route>
        </Routes>
      </AuthenticateProvider>
    </BrowserRouter>
  );
};
