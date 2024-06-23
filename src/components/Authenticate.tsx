import React, { useContext, useState } from "react";
import { Button, Dropdown, Form, Input, Menu, Modal, Row, Space } from "antd";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightFromBracket,
  faGear,
  faTicketSimple,
} from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserLogout } from "@fortawesome/free-regular-svg-icons";
import "./Authenticate.scss";
import { Link, useNavigate } from "react-router-dom";

export const Authenticate: React.FC = () => {
  const authenticate = useContext(AuthenticateContext);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return authenticate.isLogin ? (
    <Menu className="menu" theme="dark" mode="horizontal" selectable={false}>
      <Row justify={"center"}>
        <p>
          <i>Welcome, {authenticate.displayName?.current}</i>
        </p>
        <Menu.Item key="3">
          <Dropdown
            menu={{
              items: [
                ...(authenticate.role?.current === 1
                  ? [
                      {
                        key: "ticket",
                        label: "Ticket",
                        icon: <FontAwesomeIcon icon={faTicketSimple} />,
                        onClick: () => {
                          navigate("/ticket");
                        },
                      },
                    ]
                  : []),
                {
                  key: "userSetting",
                  label: "User Setting",
                  icon: <FontAwesomeIcon icon={faGear} />,
                  onClick: () => {
                    console.log("User Setting");
                  },
                },
                {
                  key: "logout",
                  label: "Logout",
                  icon: <FontAwesomeIcon icon={faRightFromBracket} />,
                  onClick: () => {
                    authenticate.logout();
                  },
                },
              ],
            }}
          >
            <Button>
              <Space>
                <FontAwesomeIcon className="fa-icon" icon={faUserLogout} />
              </Space>
            </Button>
          </Dropdown>
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
      <Modal
        className="modal-login"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form
          className="modal-form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={(values) => {
            if (authenticate.login(values.username, values.password)) {
              setModalOpen(false);
            }
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
          {authenticate.loginError && <p className="error">{authenticate.loginError}</p>}
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Link to={"/register"} className="register" onClick={() => setModalOpen(false)}>
              Doesn't have an account yet?
            </Link>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
