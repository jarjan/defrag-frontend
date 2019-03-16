import React, { Component, Fragment } from "react";
import Link from "next/link";
import {
  message,
  Button,
  Divider,
  Card,
  Input,
  Form,
  Layout,
  Steps,
  Icon,
  Skeleton,
  Tabs,
  Progress
} from "antd";
import axios from "axios";
import "antd/dist/antd.css";

const { Step } = Steps;
const { Header, Footer, Content } = Layout;
const { Item } = Form;
const { TabPane } = Tabs;

import Head from "../components/head";
import Webcam from "../components/webcam";
import Camera from "../components/camera";

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
      // { title: "Check", icon: <Icon type="check" /> },
      { title: "Result", icon: <Icon type="meh" /> }
    ],
    result: {}
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
    console.log(e);

    const data = new FormData(this.form.current);

    axios
      .post("https://defrag-backend.herokuapp.com/check", data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            fileLoading: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      })
      .then(res => {
        message.success(res.statusText);
        this.setState({ result: res.data });
      });
  };

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      fileLoading: 0
    });
  };

  render() {
    const { currentStep, steps } = this.state;

    return (
      <Fragment>
        <Head title="Home" />
        <Layout>
          <Header>Header</Header>
          <Content>
            <Card style={{ maxWidth: 600, margin: "auto", paddingTop: 20 }}>
              <Steps style={{ padding: 20 }}>
                {steps.map(({ title, icon }, index) => (
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
                  <Item required label="Company name:">
                    <Input name="companyName" />
                  </Item>
                  <Item required label="Beneficial owner:">
                    <Input name="beneficialOwner" />
                  </Item>
                  <Item required label="Tax ID:">
                    <Input name="taxId" />
                  </Item>

                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Upload ID:" key="1">
                      <Item>
                        <Input
                          required
                          type="file"
                          name="photoId"
                          id="photoId"
                          onChange={this.handleselectedFile}
                        />
                      </Item>
                    </TabPane>
                    <TabPane tab="Webcam:" key="2">
                      <Webcam />
                    </TabPane>
                    <TabPane tab="Camera:" key="3">
                      Content of Tab Pane 3
                    </TabPane>
                  </Tabs>

                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Progress percent={Math.round(this.state.fileLoading, 2)} />
                  <Divider />
                  <Button onClick={this.goPrev}>Prev</Button>
                  <Button onClick={this.goNext}>Next</Button>
                </form>
              )}

              {currentStep === 1 && (
                <Fragment>
                  <Skeleton active />
                  <Divider />
                  <Button onClick={this.goPrev}>Prev</Button>
                  <Button onClick={this.goNext}>Next</Button>
                </Fragment>
              )}

              {currentStep === 2 && (
                <Fragment>
                  RESULT
                  <Divider />
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
