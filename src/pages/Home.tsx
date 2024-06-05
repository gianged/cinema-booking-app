import React from "react";
import "./Home.scss";
import { Layout, Menu, Row, Col } from "antd";
import { Link, Outlet } from "react-router-dom";
import { Authenticate } from "../components/Authenticate";

const { Header, Content, Footer } = Layout;
const { Item } = Menu;

export const Home: React.FC = () => {
  return (
    <>
      <Layout className="layout">
        <Header className="header">
          <div className="logo" />
          <Row className="menu" justify="space-between">
            <Col>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
                <Item key="1">
                  <Link to="/">Home</Link>
                </Item>
                <Item key="2">
                  <Link to="/">Movies</Link>
                </Item>
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
    </>
  );
};
