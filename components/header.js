import React from "react";
import Link from "next/link";
import { Menu, Layout } from "antd";

const Header = ({ active }) => (
  <Layout.Header>
    <Menu
      theme="dark"
      mode="horizontal"
      style={{ lineHeight: "64px" }}
      defaultSelectedKeys={[active]}
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
  </Layout.Header>
);

export default Header;
