import React, { Component } from "react";
import { Table } from "antd";
import axios from "axios";

const columns = [
  {
    title: "Company Name",
    dataIndex: "companyName"
  },
  {
    title: "Company Tax ID",
    dataIndex: "taxId"
  },
  {
    title: "Beneficial Owner",
    dataIndex: "beneficialOwner"
  }
  //   {
  //     title: "Results",
  //     dataIndex: "results"
  //   }
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
    return (
      <Table
        columns={columns}
        rowKey={item => item.taxId}
        dataSource={this.state.data}
        loading={this.state.loading}
      />
    );
  }
}

export default TableWrapper;
