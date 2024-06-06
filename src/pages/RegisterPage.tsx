import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { Form, Button, Input } from "antd";
import "./RegisterPage.scss";

export const RegisterPage: React.FC = () => {
  const authetication = useContext(AuthenticateContext);
  const navigate = useNavigate();

  return (
    <Form
      className="login-form"
      labelCol={{ span: 4, offset: 2 }}
      wrapperCol={{ span: 4 }}
      onFinish={(values) => {
        navigate("/");
      }}
    >
      <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
          () => ({
            validator(_, value) {
              const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
              if (pattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject("Password must be at least 8 characters long, contain letters and numbers!");
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please input your password!" },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject("The two passwords that you entered do not match!");
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 4 }}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          Go Back
        </Button>
      </Form.Item>
    </Form>
  );
};
