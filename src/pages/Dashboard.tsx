import React, { useState, useEffect } from "react";
import { Card, Col, Row, Space } from "antd";
import "./Dashboard.scss";
import { convertBlobToBase64 } from "../convert";

const getShow = async () => {
  const response = await fetch("http://localhost:4000/show");
  const data = await response.json();
  if (data.length !== 0) {
    data.forEach((item: any) => {
      item.poster = convertBlobToBase64(item.poster);
    });
  }
  //TODO: array might need fixing
  return data;
};

export const Dashboard: React.FC = () => {
  const [show, setShow] = useState<any[]>([]);

  useEffect(() => {
    getShow().then((data) => {
      setShow(data);
    });
  }, []);

  return (
    <>
      {show.length !== 0 ? (
        <Space>
          <Row gutter={[16, 16]}>
            {show.map((item) => (
              <Col span={6}>
                <Card>
                  <img src={item.poster} alt="Poster" />
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      ) : (
        <Row>
          <h1 className="no-data">No Data to show</h1>
        </Row>
      )}
    </>
  );
};

// XXX: Unused components
