import React, { useContext, useState } from "react";
import { Button, Form, Input, Menu, Modal, Row } from "antd";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserLogout } from "@fortawesome/free-regular-svg-icons";
import "./Authenticate.scss";

export const Authenticate: React.FC = () => {
  const authenticate = useContext(AuthenticateContext);
  const [modalOpen, setModalOpen] = useState(false);

  return authenticate.isLogin ? (
    <Menu className="menu" theme="dark" mode="horizontal" selectable={false}>
      <Row justify={"center"}>
        <p>
          <i>Welcome, {authenticate.displayName?.current}</i>
        </p>
        <Menu.Item key="3">
          <Button type="primary" onClick={() => authenticate.logout()}>
            <FontAwesomeIcon className="fa-icon" icon={faUserLogout} />
            Logout
          </Button>
        </Menu.Item>
      </Row>
    </Menu>
  ) : (
    <>
      <Menu className="menu" theme="dark" mode="horizontal" selectable={false}>
        <Menu.Item key="3">
          <Button type="primary" onClick={() => setModalOpen(true)}>
            <FontAwesomeIcon className="fa-icon" icon={faUser} />
            Login
          </Button>
        </Menu.Item>
      </Menu>
      <Modal className="modal-login" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form
          className="modal-form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={(values) => {
            authenticate.login(values.username, values.password);
            setModalOpen(false);
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
