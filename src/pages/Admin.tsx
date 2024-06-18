import React from "react";
import { Layout, Menu } from "antd";
import "./Admin.scss";
import { Link } from "react-router-dom";

const { Sider } = Layout;

export const Admin: React.FC = () => {
  return (
    <>
      <Sider className="sider" trigger={null} collapsible theme="dark">
        <Menu theme="dark" mode="inline">
          <Menu.Item key="user">
            <Link to={"/manage/user"}>Users</Link>
          </Menu.Item>
          <Menu.Item key="film">
            <Link to={"/manage/film"}>Films</Link>
          </Menu.Item>
          <Menu.Item key="category">
            <Link to={"/manage/category"}>Categories</Link>
          </Menu.Item>
          <Menu.Item key="show">
            <Link to={"/manage/show"}></Link>Show Schedule
          </Menu.Item>
          <Menu.Item key="ticket">Ticket</Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};
