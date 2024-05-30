import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./FilmCard.scss";
import { Link } from "react-router-dom";

const { Meta } = Card;

const filmCardData = async () => {
  const response = await fetch("http://localhost:4000/film/currentshow", {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const FilmCard = () => {
  const [filmData, setFilmData] = useState([]);

  useEffect(() => {
    filmCardData().then((data: any) => {
      setFilmData(data);
    });
  }, []);

  return (
    <>
      <Row justify="center" gutter={[24, 24]}>
        {filmData.map((item: any) => (
          <Col key={item.id} span={4}>
            <Card hoverable className="filmCard">
              <img
                className="filmCardImage"
                alt="film poster"
                src={item.poster}
              />
              <div className="filmCardHover">
                <Button>
                  <Link to={"/"}>
                    <FontAwesomeIcon
                      className="filmCardIcon"
                      icon={faReceipt}
                    />
                    Book
                  </Link>
                </Button>
                <Button>
                  <Link to={"/"}>
                    <FontAwesomeIcon
                      className="filmCardIcon"
                      icon={faCircleInfo}
                    />
                    Detail
                  </Link>
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

//TODO: Paging
