import React from "react";
import { SlideShow } from "../components/SlideShow";
import { FilmCard } from "../components/FilmCard";

export const HomeContent: React.FC = () => {
    return (
        <>
            <SlideShow />
            <FilmCard />
        </>
    );
};
