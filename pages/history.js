import React, { Fragment } from "react";
import { Layout, Card } from "antd";
import "antd/dist/antd.css";
import "../static/style.css";

const { Footer, Content } = Layout;

import Head from "../components/head";
import Table from "../components/table";

const History = () => (
  <Fragment>
    <Head title="History" />
    <Layout>
      <Header active="2" />
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
