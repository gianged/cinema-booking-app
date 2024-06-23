import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Modal, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import "./FilmDetail.scss";
import { FilmSchedule } from "../components/FilmSchedule";

const getFilmDetail = async (id: string) => {
  const response = await fetch(`http://localhost:4000/film/${id}`, {
    method: "GET",
  });
  const data = await response.json();
  if (data.poster) {
    const base64String = btoa(
      new Uint8Array(data.poster.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    data.poster = `data:image/jpge;base64,${base64String}`;
  }
  return data;
};

export const FilmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<any>({});
  const [showModalVideo, setShowModalVideo] = useState(false);

  useEffect(() => {
    getFilmDetail(id ?? "").then((data) => setFilm(data));
  }, [id]);

  return (
    <>
      <Row justify="center" className="filmDetail" gutter={[24, 24]}>
        <Col className="image-container" span={4}>
          <img className="filmDetailImage" src={film.poster} alt="Poster" />
          <div className="play-button">
            <FontAwesomeIcon
              icon={faPlayCircle}
              size="3x"
              onClick={() => setShowModalVideo(true)}
            />
          </div>
        </Col>
        <Col className="text-container" span={8}>
          <h1>{film.filmName}</h1>
          <p>{film.filmDescription}</p>
          <p>Category: {film.categories}</p>
          <p>Premiere: {film.premiere}</p>
        </Col>
      </Row>

      <FilmSchedule />

      <Modal
        open={showModalVideo}
        footer={null}
        onCancel={() => {
          setShowModalVideo(false);
        }}
        centered
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${film.trailer}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Modal>
    </>
  );
};

//TODO: add button
