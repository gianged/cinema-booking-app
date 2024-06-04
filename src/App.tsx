import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { FilmDetail } from "./pages/FilmDetail";
import { HomeContent } from "./pages/HomeContent";
import {
  AuthenticateProvider,
} from "./contexts/AuthenticateContext";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthenticateProvider>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<HomeContent />} />
            <Route path="/filmdetail/:id" element={<FilmDetail />} />
          </Route>
          <Route path="/admin" element={""}>
            {/* TODO: Add admin routes */}
          </Route>
        </Routes>
      </AuthenticateProvider>
    </BrowserRouter>
  );
};
