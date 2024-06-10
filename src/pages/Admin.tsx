import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { Layout, Menu } from "antd";
import "./Admin.scss";

const { Header, Sider, Content, Footer } = Layout;

export const Admin: React.FC = () => {
  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible theme="dark">
          <Menu theme="dark" mode="inline">
            <Menu.Item key="5">Dashboard</Menu.Item>
            <Menu.Item key="6">Users</Menu.Item>
            <Menu.Item key="7">Films</Menu.Item>
            <Menu.Item key="8">Categories</Menu.Item>
            <Menu.Item key="9">Show Schedule</Menu.Item>
            <Menu.Item key="10">Review</Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </>
  );
};
