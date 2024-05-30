import React from "react";
import "./Home.scss";
import { Layout, Menu, Image, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { SlideShow } from "./SlideShow";
import { FilmCard } from "./FilmCard";

const { Header, Content, Footer } = Layout;

export const Home = () => {
  return (
    <>
      <Layout>
        <Header className="header">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">
              <Image></Image>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/">Movies</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content>
          <SlideShow />
          <FilmCard />
        </Content>
        <Footer className="footer">
          <Row justify={"start"}>
            <Col span={24}>
              <p>Some copyright 2024</p>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </>
  );
};
