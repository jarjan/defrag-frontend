import React, { Fragment } from "react";
import { Layout, Card, Row, Col } from "antd";
import "antd/dist/antd.css";
import "../static/style.css";

import Head from "../components/head";
import Header from "../components/header";
import Footer from "../components/footer";
import Logo from "../components/logo";
import Table from "../components/table";

const History = () => (
  <Fragment>
    <Head title="History" />
    <Layout>
      <Header active="2" />
      <Layout.Content>
        <Card style={{ maxWidth: 800, margin: "auto", paddingTop: 20 }}>
          <Logo />
          <h4>Your check history:</h4>
          <Table />
        </Card>
      </Layout.Content>
      <Footer />
    </Layout>
  </Fragment>
);

export default History;
