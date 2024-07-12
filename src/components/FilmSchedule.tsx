import { Card, Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookingContext } from "../contexts/BookingContext";

const loadActiveShow = async (id: string) => {
    const response = await fetch(`http://localhost:4000/show/active/${id}`, {
        method: "GET",
    });
    const data = await response.json();
    return data;
};

export const FilmSchedule: React.FC = () => {
    const bookingData = useContext(BookingContext);
    const {id} = useParams<{ id: string }>();
    const [show, setShow] = useState<[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadActiveShow(id ?? "").then((data) => setShow(data));
    }, []);

    return (
        <>
            <Row gutter={[16, 16]} justify={"center"}>
                {show.map((item: any) => (
                    <Col span={3}>
                        <Card
                            title={item.showDay}
                            key={item.id}
                            hoverable
                            onClick={() => {
                                bookingData.setData(Number(id) || 0, item.id, item.showPrice);
                                navigate("/booking");
                            }}
                        >
                            <p>
                                {item.beginTime}-{item.endTime}
                            </p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};
