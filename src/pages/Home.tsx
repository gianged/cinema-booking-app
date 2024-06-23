import React, { useContext } from "react";
import "./Home.scss";
import { Layout, Menu, Row, Col } from "antd";
import { Link, Outlet } from "react-router-dom";
import { Authenticate } from "../components/Authenticate";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { Admin } from "./Admin";

const { Header, Content, Footer } = Layout;
const { Item } = Menu;

export const Home: React.FC = () => {
  const authenticate = useContext(AuthenticateContext);

  return (
    <>
      <Layout className="layout">
        <Header className="header">
          <div className="logo">
            <img className="logo-image" src={process.env.PUBLIC_URL + "/logo192.png"} alt="logo" />
          </div>
          <Row className="menu" justify="space-between">
            <Col>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
                <Item key="home">
                  <Link to="/">Home</Link>
                </Item>
              </Menu>
            </Col>
            <Col>
              <Authenticate />
            </Col>
          </Row>
        </Header>
        <Layout>
          {authenticate.role?.current === 2 ? <Admin /> : <></>}
          <Layout>
            <Content className="content">
              <Outlet />
            </Content>
            <Footer className="footer">
              <Row justify={"start"}>
                <Col span={24}>
                  <p>Some copyright 2024</p>
                  <p>
                    Data based on{" "}
                    <a href="https://www.themoviedb.org/" rel="noreferrer" target="_blank">
                      https://www.themoviedb.org/
                    </a>
                  </p>
                  <p>
                    Special thanks to{" "}
                    <a href="https://simulantion.artstation.com/" rel="noreferrer" target="_blank">
                      Ms. Lan
                    </a>{" "}
                    making awesome icons.
                  </p>
                </Col>
              </Row>
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};
