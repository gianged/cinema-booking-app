import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Modal, InputNumber, Space } from "antd";
import QRCode from "qrcode.react";
import { useCookies } from "react-cookie";
import "./Payment.scss"

const addTicket = async (
  idUser: number,
  idShow: number,
  ticketAmount: number,
  totalPrice: number
) => {
  const response = await fetch("http://localhost:4000/ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idUser,
      idShow,
      ticketAmount,
      totalPrice,
    }),
  });

  const data = await response.json();
  return data;
};

export const Payment = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [randomNumber, setRandomNumber] = useState(Math.floor(100000 + Math.random() * 900000));
  const [bookingDataCookies] = useCookies(["bookingData"]);
  const [authenticateCookie] = useCookies(["authenticate"]);

  useEffect(() => {
    setRandomNumber(Math.floor(100000 + Math.random() * 900000));
    if (
      bookingDataCookies.bookingData.filmId === undefined ||
      bookingDataCookies.bookingData.showId === undefined
    ) {
      navigate("/");
    }
  }, [bookingDataCookies.bookingData, navigate]);

  return (
    <>
      <Form name="credit_card" labelCol={{ offset: 4, span: 2 }} wrapperCol={{ span: 6 }}>
        <Form.Item name="cardNumber" label="Card Number" required>
          <InputNumber placeholder="1234 1234 1234 1234" style={{width: 460}} />
        </Form.Item>

        <Form.Item
          name="expiryDate"
          label="Expiry Date"
          rules={[
            { required: true, message: "Please input the expiry date!" },
            {
              validator(_, value) {
                const regex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
                if (value && !regex.test(value)) {
                  return Promise.reject(
                    new Error("Please input the expiry date in the format MM/YY!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="MM/YY" />
        </Form.Item>

        <Form.Item name="cardName" label="Cardholder Name" required>
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item name="cvv" label="CVV" required>
          <InputNumber placeholder="123" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit" onClick={() => setModalOpen(true)}>
              Submit
            </Button>
            <Button onClick={() => navigate("/")}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal open={modalOpen} footer={null} onCancel={() => setModalOpen(false)}>
        <QRCode value={randomNumber.toString()} />

        <Form
          onFinish={async () => {
            const totalPrice =
              bookingDataCookies.bookingData.showPrice *
              bookingDataCookies.bookingData.ticketAmount;
            await addTicket(
              authenticateCookie.authenticate.id,
              bookingDataCookies.bookingData.showId,
              bookingDataCookies.bookingData.ticketAmount,
              totalPrice
            );
            navigate("/ticket");
          }}
        >
          <Form.Item
            name="number"
            label="Enter the number from the QR code"
            rules={[
              { required: true, message: "Please input the number from the QR code!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || randomNumber === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two numbers do not match!"));
                },
              }),
            ]}
          >
            <InputNumber min={100000} max={999999} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
