import React, { Component, Fragment } from "react";
import Link from "next/link";
import {
  notification,
  Button,
  Card,
  Input,
  Form,
  Layout,
  Steps,
  Icon
} from "antd";
import axios from "axios";
import "antd/dist/antd.css";

const { Step } = Steps;
const { Header, Footer, Content } = Layout;
const { Item } = Form;

import Head from "../components/head";

class Home extends Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
  }
  state = {
    fileLoading: 0,
    selectedFile: null,
    currentStep: 0,
    steps: [
      { title: "Input", icon: <Icon type="edit" /> },
      { title: "Verification", icon: <Icon type="solution" /> },
      { title: "Check", icon: <Icon type="check" /> },
      { title: "Result", icon: <Icon type="meh" /> }
    ]
  };

  getStatus = index => {
    const { currentStep } = this.state;
    return index === currentStep
      ? "process"
      : index > currentStep
      ? "wait"
      : "finish";
  };

  goNext = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  };

  goPrev = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep - 1 });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      fileLoading: 0
    });
  };

  handleUpload = () => {
    const data = new FormData(this.form.current);
    console.log(data);
    // data.append("file", this.state.selectedFile, this.state.selectedFile.name);

    axios
      .post("https://defrag-backend.herokuapp.com/check", data, {
        // .post("http://localhost:3000/check", data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            fileLoading: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      })
      .then(res => {
        notification.open({
          message: res.statusText
        });
      });
  };

  render() {
    const { currentStep, steps } = this.state;

    return (
      <Fragment>
        <Head title="Home" />
        <Layout>
          <Header>Header</Header>
          <Content style={{ padding: "20px 50px" }}>
            <Card>
              <Steps style={{ padding: 24 }}>
                {steps.map(({ status, title, icon }, index) => (
                  <Step
                    key={title}
                    status={this.getStatus(index)}
                    title={title}
                    icon={icon}
                  />
                ))}
              </Steps>

              {currentStep === 0 && (
                <form
                  onSubmit={this.handleSubmit}
                  ref={this.form}
                  encType="multipart/form-data"
                  method="post"
                >
                  <Item label="Input company name:">
                    <Input />
                  </Item>

                  <Input
                    type="file"
                    name="photoId"
                    id="photoId"
                    onChange={this.handleselectedFile}
                  />
                  <Button onClick={this.handleUpload}>Upload</Button>
                  <div> {Math.round(this.state.fileLoading, 2)} %</div>

                  <Button onClick={this.goPrev}>Prev</Button>
                  <Button onClick={this.goNext}>Next</Button>
                </form>
              )}

              {currentStep === 1 && (
                <Fragment>
                  Doing some verification
                  <Button onClick={this.goPrev}>Prev</Button>
                  <Button onClick={this.goNext}>Next</Button>
                </Fragment>
              )}

              {currentStep === 2 && (
                <Fragment>
                  Doing some check
                  <Button onClick={this.goPrev}>Prev</Button>
                  <Button onClick={this.goNext}>Next</Button>
                </Fragment>
              )}

              {currentStep === 3 && (
                <Fragment>
                  Here is result
                  <Button onClick={this.goPrev}>Prev</Button>
                  <Button onClick={this.goNext}>Next</Button>
                </Fragment>
              )}
            </Card>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            2019. Big Brother. Societe Generale Equipment Finance (SGEF).
            BeMyApp.
          </Footer>
        </Layout>
      </Fragment>
    );
  }
}

export default Home;
