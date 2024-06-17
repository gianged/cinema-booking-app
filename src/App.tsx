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
          </Route>
        </Routes>
      </AuthenticateProvider>
    </BrowserRouter>
  );
};
