import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SlideShow.scss";
import { Carousel } from "antd";

const slideShowData = async () => {
  const response = await fetch("http://localhost:4000/film/currentshow", {
    method: "GET",
  });
  const data = await response.json();
  if (Array.isArray(data)) {
    for (let item of data) {
      if (item.backdrop) {
        const base64String = btoa(
          new Uint8Array(item.backdrop.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        item.backdrop = `data:image/jpge;base64,${base64String}`;
      }
    }
  }

  return data;
};

export const SlideShow: React.FC = () => {
  const [data, setData] = useState<[]>([]);
  const [hover, setHover] = useState<boolean>(true);

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
              <img src={item.backdrop} alt="Backdrop" />
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
