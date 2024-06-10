import React, { useContext, useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { Layout, Menu, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { Authenticate } from "../components/Authenticate";
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
        <Layout className="layout">
          <Header className="header">
            <div className="logo" />
            <Row className="menu" justify="space-between">
              <Col>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
                  <Menu.Item key="1">
                    <Link to="/">Home</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/">Movies</Link>
                  </Menu.Item>
                </Menu>
              </Col>
              <Col>
                <Authenticate />
              </Col>
            </Row>
          </Header>
          <Content className="content">
            <Outlet />
          </Content>
          <Footer className="footer">
            <Row justify={"start"}>
              <Col span={24}>
                <p>Some copyright 2024</p>
                <p>
                  Data base on <a href="https://www.themoviedb.org/">https://www.themoviedb.org/</a>
                </p>
              </Col>
            </Row>
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};
