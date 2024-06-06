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
        authetication.login(values.username, values.password);
        if (authetication.isLogin) navigate("/");
      }}
    >
      <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!", pattern: RegExp("/(w*d*){8,}/gm") }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        rules={[{ required: true, message: "Please input your password!"}]}
      >
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
