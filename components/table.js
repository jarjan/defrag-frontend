import React, { Component } from "react";
import { Table, Tag, Badge, Icon } from "antd";
import axios from "axios";

const columns = [
  {
    title: "Company Name",
    dataIndex: "companyName"
  },
  {
    title: "Signer Tax ID",
    dataIndex: "taxId"
  },
  {
    title: "Beneficial Owner",
    dataIndex: "beneficialOwner"
  }
];

class TableWrapper extends Component {
  state = {
    data: [],
    pagination: {},
    loading: false
  };

  componentDidMount() {
    this.fetch();
  }

  fetch = (params = {}) => {
    this.setState({ loading: true });
    axios.get("https://defrag-backend.herokuapp.com/history").then(res => {
      console.log(res);
      this.setState({
        loading: false,
        data: res.data.histories
      });
    });
  };

  render() {
    const renderErrors = (errors, row) => {
      const showErrors = errors.map(error => {
        return <Tag color="volcano" key={error.message.length}>{error.message}</Tag>
      });
      if (showErrors.length === 0) {
        if (row.isChecked) {
          return <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
        } else {
          return <Icon type="check-circle" theme="twoTone" twoToneColor="#cccccc" />
        }
      }
      return showErrors;
    }

    const renderStatus = (status) => {
      return status ? <span><Badge status="success" />Yes</span> :
        <span><Badge status="error" />No</span>
    }

    const expandedRowRender = (results) => {
      const columns = [
        { title: 'Title', dataIndex: 'title', key: 'checkTitle' },
        { title: 'Is checked', dataIndex: 'isChecked', key: 'isChecked', render: (status) => renderStatus(status) },
        { title: 'Errors', dataIndex: 'errors', render: (errors, row) => renderErrors(errors, row) }
      ];

      return (
        <Table
          columns={columns}
          rowKey={item => item.title}
          dataSource={results}
          pagination={false}
          size="small"
        />
      );
    };
  
    return (
      <Table
        columns={columns}
        scroll={{ x: 'fit-content' }}
        rowKey={item => item.taxId}
        dataSource={this.state.data}
        expandedRowRender={record => expandedRowRender(record.results)}
        loading={this.state.loading}
      />
    );
  }
}

export default TableWrapper;
