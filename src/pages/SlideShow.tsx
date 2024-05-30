import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SlideShow.scss";
import { Carousel } from "antd";

const slideShowData = async () => {
  const response = await fetch("http://localhost:4000/film/currentshow", { method: "GET" });
  const data = await response.json();
  return data;
};

export const SlideShow = () => {
  const [data, setData] = useState([]);
  const [hover, setHover] = useState(true);

  const MouseOver = () => {
    setHover(false);
  };

  const mouseLeave = () => {
    setHover(true);
  };

  useEffect(() => {
    slideShowData().then((data) => setData(data));
    }, []);

  return (
    <>
      <Carousel autoplay arrows className="slideCarousel">
        {data.map((item: any) => (
          <div key={item.id} onMouseOver={MouseOver} onMouseLeave={mouseLeave}>
            <div className="slideShowImage">
              <img src={process.env.PUBLIC_URL + item.backdrop} />
              <div className="slideShowDetail" hidden={hover}>
                <h1>{item.filmName}</h1>
                <p>{item.filmDescription}</p>
                <Link to={""}>View Detail</Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </>
  );
};

//TODO: Fix Link
