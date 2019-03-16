import React, { Fragment } from "react";
import Link from "next/link";
import { Layout, Menu, Card } from "antd";
import "antd/dist/antd.css";

const { Header, Footer, Content } = Layout;

import Head from "../components/head";
import Table from "../components/table";

const History = () => (
  <Fragment>
    <Head title="History" />
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: "64px" }}
          defaultSelectedKeys={["2"]}
        >
          <Menu.Item key="1">
            <Link href="/">
              <a>Home</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/history">
              <a>History</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <Card style={{ maxWidth: 800, margin: "auto", paddingTop: 20 }}>
          <h4>Your check history:</h4>
          <Table />
        </Card>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        2019. Big Brother. Societe Generale Equipment Finance (SGEF). BeMyApp.
      </Footer>
    </Layout>
  </Fragment>
);

export default History;
