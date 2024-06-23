import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./FilmCard.scss";
import { Link } from "react-router-dom";

const filmCardData = async () => {
  const response = await fetch("http://localhost:4000/film/currentshow", {
    method: "GET",
  });
  const data = await response.json();
  if (Array.isArray(data)) {
    for (let item of data) {
      if (item.poster) {
        const base64String = btoa(
          new Uint8Array(item.poster.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        item.poster = `data:image/jpge;base64,${base64String}`;
      }
    }
  }

  return data;
};

export const FilmCard: React.FC = () => {
  const [filmData, setFilmData] = useState<[]>([]);

  useEffect(() => {
    filmCardData().then((data: any) => {
      setFilmData(data);
    });
  }, []);

  return (
    <Row justify="center" gutter={[24, 24]}>
      {filmData.map((item: any) => (
        <Col key={item.id} span={4}>
          <Card hoverable className="filmCard">
            <img className="filmCardImage" alt="Poster" src={item.poster} />
            <div className="filmCardHover">
              <Link to={`/filmdetail/${item.id}`}>
                <Button>
                  <FontAwesomeIcon className="filmCardIcon" icon={faCircleInfo} />
                  Detail
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

//TODO: Paging
