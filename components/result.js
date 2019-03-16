import React, { Fragment } from "react";
import { Table, Typography, List, Icon, Divider } from "antd";

const { Text } = Typography;

const ResultError = ({ message }) => (
  <Fragment>
    <Text type="danger">{message}</Text>
    <Divider type="vertical" />
  </Fragment>
);

const ResultItem = ({ item }) => (
  <List.Item>
    {item.isChecked ? (
      item.errors.length === 0 ? (
        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
      ) : (
        <Icon type="stop" theme="twoTone" twoToneColor="#cf1322" />
      )
    ) : (
      <Icon type="clock-circle" theme="twoTone" twoToneColor="#555555" />
    )}{" "}
    {item.title}
    {item.errors.length > 0 && <Divider dashed style={{ margin: "10px 0" }} />}
    {item.errors.map(({ message }) => (
      <ResultError key={message} message={message} />
    ))}
  </List.Item>
);

const Result = ({ result }) => (
  <div>
    <h4>Results:</h4>
    <List
      size="small"
      bordered
      dataSource={result.results}
      renderItem={item => <ResultItem item={item} />}
    />
  </div>
);

export default Result;
