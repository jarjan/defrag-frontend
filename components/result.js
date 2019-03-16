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
    {item.errors.length === 0 ? (
      <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
    ) : (
      <Icon type="stop" theme="twoTone" twoToneColor="#cf1322" />
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
    <h4>Your data:</h4>
    <p>{JSON.stringify(result.mirror)}</p>

    <h4>Verdict:</h4>
    <p>{JSON.stringify(result.verdict)}</p>

    <h4>Results:</h4>
    <List
      size="small"
      bordered
      //   dataSource={result.results}
      dataSource={[
        {
          title: `Company is in test system database`,
          errors: []
        },
        {
          title: `Company is not in a sanction list`,
          errors: []
        },
        {
          title: `Provided TAX number belogs to company`,
          errors: []
        },
        {
          title: `Company's valuable person is not in a sanction list`,
          errors: [{ message: "Merey Zholdas" }, { message: "Ben Laden" }]
        },
        {
          title: `Provided beneficial owner is in a list`,
          errors: []
        },
        {
          title: `Provided ID card recognised`,
          errors: []
        },
        {
          title: `Provided ID card's valdity date is not expired`,
          errors: []
        },
        {
          title: `Signer belongs to company and authorised to sign`,
          errors: [{ message: "Not found" }]
        },
        {
          title: `Signer is not in a sanction list`,
          errors: []
        }
      ]}
      renderItem={item => <ResultItem item={item} />}
    />
  </div>
);

export default Result;
