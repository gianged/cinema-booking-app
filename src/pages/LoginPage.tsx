import React, { useContext, useEffect } from "react";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";

export const LoginPage: React.FC = () => {
  const authetication = useContext(AuthenticateContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authetication.isLogin) {
      navigate("/");
    }
  }, [authetication.isLogin, navigate]);

  return (
    <Form
      className="login-form"
      labelCol={{ span: 4, offset: 2 }}
      wrapperCol={{ span: 4 }}
      onFinish={(values) => {
        authetication.login(values.username, values.password);
        if (authetication.isLogin) navigate("/");
      }}
    >
      <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 4 }}>
        <Button type="primary" htmlType="submit">
          Login
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
