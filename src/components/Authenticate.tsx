import React, { useContext, useState } from "react";
import { Button, Menu } from "antd";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserLogout } from "@fortawesome/free-regular-svg-icons";
import "./Authenticate.scss";

const { Item } = Menu;

export const Authenticate = () => {
  const authenticate = useContext(AuthenticateContext);

  return authenticate.isLogin ? (
    <Menu theme="dark" mode="horizontal" selectable={false}>
      <p>
        <i>Welcome, {authenticate.displayName}</i>
      </p>
      <Item key="3">
        <Button type="primary">
          <FontAwesomeIcon className="fa-icon" icon={faUserLogout} />
          Logout
        </Button>
      </Item>
    </Menu>
  ) : (
    <Menu theme="dark" mode="horizontal" selectable={false}>
      <Item key="3">
        <Button type="primary">
          <FontAwesomeIcon className="fa-icon" icon={faUser} />
          Login
        </Button>
      </Item>
    </Menu>
  );
};
