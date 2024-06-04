import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import "./FilmDetail.scss";

const getFilmDetail = async (id: string) => {
  const response = await fetch(`http://localhost:4000/film/${id}`, {
    method: "GET",
  });
  const data = await response.json();
  if (Array.isArray(data)) {
    for (let item of data) {
      if (item.poster) {
        const base64String = btoa(
          new Uint8Array(item.poster.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        item.poster = `data:image/jpge;base64,${base64String}`;
      }
    }
  }
  return data;
};

export const FilmDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<any>({});

  useEffect(() => {
    getFilmDetail(id ?? "").then((data) => setFilm(data[0]));
  }, [id]);

  return (
    <>
      <Row justify="center" className="filmDetail" gutter={[24, 24]}>
        <Col span={4}>
          <img className="filmDetailImage" src={film.poster} />
        </Col>
        <Col span={8}>
          <h1>{film.filmName}</h1>
          <p>{film.filmDescription}</p>
          <p>Category: {film.categories}</p>
        </Col>
      </Row>
    </>
  );
};

//TODO: add button