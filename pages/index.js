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
  Spin,
  Row,
  Col,
  Menu,
  Progress
} from "antd";
import axios from "axios";
import "antd/dist/antd.css";
import "../static/style.css";

const { Step } = Steps;
const { Header, Footer, Content } = Layout;
const { Item } = Form;
const { TabPane } = Tabs;

import Head from "../components/head";
import Webcam from "../components/webcam";
import Result from "../components/result";

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

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

    this.setState({ currentStep: 1 });

    const data = new FormData(this.form.current);
    data.delete("photoId");
    if (this.state.selectedFile)
      data.append("photoId", this.state.selectedFile, Date.now());

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
        message.success(res.statusText);
        this.setState({ result: res.data, currentStep: 2 });
      })
      .catch(() => {
        message.error("Sorry, try again");
        this.setState({ currentStep: 0 });
      });
  };

  handleselectedFile = event => {
    this.setState({
      imageSrc: URL.createObjectURL(event.target.files[0]),
      selectedFile: event.target.files[0],
      fileLoading: 0
    });
  };

  handleCamera = img => {
    this.setState({
      imageSrc: img,
      selectedFile: dataURItoBlob(img)
    });
  };

  render() {
    const { currentStep, steps, result, imageSrc } = this.state;

    return (
      <Fragment>
        <Head title="Home" />
        <Layout>
          <Header>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: "64px" }}
              defaultSelectedKeys={["1"]}
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
                  <Row>
                    <Col span={11}>
                      <Item label="Company name:">
                        <Input name="companyName" />
                      </Item>
                    </Col>
                    <Col span={2} />
                    <Col span={11}>
                      <Item label="Company tax ID:">
                        <Input name="taxId" />
                      </Item>
                    </Col>
                  </Row>
                  <Item label="Beneficial owner:">
                    <Input name="beneficialOwner" />
                  </Item>

                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Upload ID:" key="1">
                      <Item>
                        <Input
                          type="file"
                          name="photoId"
                          id="photoId"
                          onChange={this.handleselectedFile}
                        />
                      </Item>
                    </TabPane>
                    <TabPane tab="Webcam/camera:" key="2">
                      <Webcam onChange={this.handleCamera} />
                    </TabPane>
                    {/* <TabPane tab="Camera:" key="3">
                      Content of Tab Pane 3
                    </TabPane> */}
                  </Tabs>
                  <Divider />
                  <img src={imageSrc} style={{ maxWidth: "100%" }} />
                  <Divider />
                  <Button type="primary" htmlType="submit" size="large">
                    Submit
                  </Button>
                  {/* <Progress percent={Math.round(this.state.fileLoading, 2)} /> */}
                </form>
              )}

              {currentStep === 1 && (
                <Fragment>
                  <Spin /> &nbsp;We are currently checking all data...
                  <Skeleton active />
                </Fragment>
              )}

              {currentStep === 2 && (
                <Fragment>
                  <Result result={result} />
                  <Divider />
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => this.setState({ currentStep: 0 })}
                  >
                    New check
                  </Button>
                </Fragment>
              )}
            </Card>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <Row>
              <Col span={5} />
              <Col span={8}>
                <svg
                  id="Calque_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 374.1 36.9"
                >
                  <path d="M5 3.7H0V.1h14.5v3.6H9.6v12.6H5V3.7zM32 0v16.2h-4.6V9.9h-6.3v6.3h-4.6V0h4.6v6.1h6.3V0H32zM47.7 12.7v3.5h-13V0h12.7v3.5h-8.2v2.7h7.2v3.4h-7.2v3l8.5.1zM60.4 3.6v3.6h7.2v3.5h-7.2v5.6h-4.6V0h12.7v3.5h-8.1v.1zM70.9 9V0h4.6v8.8c0 2.8 1.2 3.9 3.1 3.9s3.1-1.1 3.1-3.9V0h4.5v9c0 4.8-2.8 7.5-7.6 7.5s-7.7-2.7-7.7-7.5zM93.1 3.7h-5V.1h14.5v3.6h-5v12.6H93l.1-12.6zM105 9V0h4.6v8.8c0 2.8 1.2 3.9 3.1 3.9s3-1.1 3-3.9V0h4.5v9c0 4.8-2.8 7.5-7.6 7.5S105 13.8 105 9zM129.8 11.9h-2.5v4.3h-4.6V0h7.4c4.4 0 7.2 2.3 7.2 6 .1 2.2-1.2 4.2-3.2 5.1l3.5 5.1h-4.9l-2.9-4.3zm0-8.3h-2.5v4.8h2.5c1.9 0 2.9-.9 2.9-2.4s-.9-2.4-2.9-2.4zM152.3 12.7v3.5h-13V0H152v3.5h-8.2v2.7h7.2v3.4h-7.2v3l8.5.1zM73.7 20.4h4.6v16.2h-4.6V20.4zM80.7 35.1l1.5-3.4c1.6 1 3.5 1.6 5.3 1.6 1.9 0 2.6-.5 2.6-1.3 0-2.6-9.2-.7-9.2-6.7 0-2.9 2.4-5.3 7.2-5.3 2.1 0 4.1.5 5.9 1.4l-1.4 3.4c-1.4-.8-2.9-1.2-4.5-1.3-1.9 0-2.6.7-2.6 1.5 0 2.5 9.2.6 9.2 6.6 0 2.8-2.4 5.2-7.2 5.2-2.4.2-4.7-.4-6.8-1.7zM111.1 30.8v5.8h-4.6v-5.9l-6.2-10.3h4.8l3.8 6.4 3.8-6.4h4.5l-6.1 10.4zM116.4 28.5c0-4.9 3.8-8.4 9-8.4s9 3.6 9 8.4-3.8 8.4-9 8.4-9-3.6-9-8.4zm13.4 0c.1-2.4-1.7-4.5-4.2-4.6-2.4-.1-4.5 1.7-4.6 4.2v.4c-.1 2.4 1.7 4.5 4.2 4.6 2.4.1 4.5-1.7 4.6-4.2v-.4zM137.1 29.4v-9h4.6v8.8c0 2.8 1.2 3.9 3.1 3.9s3-1.1 3-3.9v-8.8h4.5v9c0 4.8-2.8 7.5-7.6 7.5s-7.6-2.7-7.6-7.5z" />
                  <path fill="none" d="M-12.5-12.5h314.6v61.6H-12.5z" />
                  <path
                    class="st1"
                    d="M203.5 10.5c-1.3-.6-2.8-1-4.1-1-1.9 0-2.8.4-2.8 1.1 0 2.1 8.4.4 8.4 4.8 0 1.8-1.7 3.3-5.2 3.3-2 0-3.6-.4-5.5-1.4l.8-1.7c1.6.9 3.1 1.3 4.7 1.3 2 0 3.1-.6 3.1-1.5 0-2.3-8.4-.6-8.4-4.7 0-1.8 1.7-3 4.8-3 1.8 0 3.4.4 4.9 1.1l-.7 1.7zM212.8 18.8c-3.3 0-6.1-2.2-6.1-5.6 0-3.3 2.8-5.6 6.1-5.6 3.4 0 6.1 2.3 6.1 5.6 0 3.4-2.7 5.6-6.1 5.6m0-9.3c-2.4 0-4.1 1.7-4.1 3.8 0 2.2 1.6 3.8 4.1 3.8s4.1-1.6 4.1-3.8c0-2.1-1.6-3.8-4.1-3.8M226.9 18.8c-3.5 0-6.2-2.2-6.2-5.6 0-3.3 2.7-5.5 6.2-5.5 2.1 0 3.6.6 4.9 1.6l-1 1.5c-1-.7-2.2-1.3-3.8-1.3-2.6 0-4.2 1.6-4.2 3.7 0 2.2 1.6 3.7 4.2 3.7 1.6 0 2.9-.5 3.9-1.3l1 1.5c-1.3 1.2-2.9 1.7-5 1.7M234 8h1.9v10.5H234zM238.9 18.6V8h9.5v1.8h-7.6v2.5h5.9v1.8h-5.9v2.7h8v1.8zM256 9.8v8.8h-1.9V9.8h-4.3V8h10.5v1.8zM261.9 18.6V8h9.5v1.8h-7.6v2.5h6v1.8h-6v2.7h8v1.8zM284.3 17c1.1 0 2.2-.2 3-.6v-3.1h1.9v4.1c-1.3.9-3.2 1.4-5 1.4-3.5 0-6.2-2.2-6.2-5.6 0-3.3 2.7-5.5 6.2-5.5 2 0 3.6.6 4.9 1.6l-1 1.5c-1-.7-2.2-1.2-3.8-1.2-2.6-.1-4.2 1.6-4.2 3.7s1.7 3.7 4.2 3.7M291.8 18.6V8h9.6v1.8h-7.7v2.5h6v1.8h-6v2.7h8v1.8zM305.5 18.6h-1.9V8h2l6.8 7.9c-.1-2-.1-3.6-.1-5.2V8h1.9v10.5h-2l-6.8-7.9c.1 1.6.1 4.3.1 5.2v2.8zM317 18.6V8h9.6v1.8H319v2.5h5.9v1.8H319v2.7h7.9v1.8zM334.1 14.7H331v3.9h-2V8h6.8c2.2 0 3.6 1.4 3.6 3.4 0 1.9-1.4 3-3 3.2l3.1 3.9h-2.4l-3-3.8zm1.4-1.8c1.2 0 1.9-.6 1.9-1.5 0-1-.6-1.6-1.7-1.6h-4.8V13h4.6v-.1zM343.5 16l-1.2 2.6h-2.1l5.1-10.5h2l5.1 10.5h-2.1l-1.2-2.6h-5.6zm.8-1.7h4.1l-2-4.3-2.1 4.3zM353.9 18.6V8h1.9v8.8h7v1.8zM364.1 18.6V8h9.6v1.8h-7.6v2.5h5.9v1.8h-5.9v2.7h8v1.8z"
                  />
                  <g>
                    <path
                      class="st1"
                      d="M194.5 23h4.4l-.4 1h-2.7v2.4h2.7v1.1h-2.7v2.6h3.1v1h-4.4zM200 28.3c0-2.1 1.5-3.2 3.3-3.2.8 0 1.6.2 2 .4v8.6H204v-3.2c-.4.3-.9.4-1.4.4-1.3 0-2.6-1-2.6-3m4.1 1.5v-3.5c-.2-.1-.5-.1-.8-.1-1.2 0-1.9.9-1.9 2.1 0 1.1.6 1.9 1.6 1.9.5 0 .8-.2 1.1-.4M207 30.1c-.1-.3-.2-.7-.2-1.2v-3.7h1.3v3.5c0 .3 0 .6.1.8.1.4.4.6.9.6.6 0 1.1-.3 1.4-.6v-4.3h1.3v4.3c0 .8 0 1.3.1 1.6h-1.1l-.3-.6c-.5.4-1.1.8-1.9.8-.5 0-1.3-.3-1.6-1.2M213.2 23.4c0-.4.3-.8.8-.8s.8.3.8.8c0 .4-.3.8-.8.8-.4 0-.8-.3-.8-.8m.2 1.9h1.3v5.9h-1.3v-5.9zM216.2 25.5c.6-.2 1.4-.4 2.1-.4 2 0 3.1 1.2 3.1 3.1 0 1.8-1.2 3.1-3 3.1-.3 0-.7-.1-.9-.2v3h-1.3v-8.6zm2.2 4.7c1.2 0 1.8-.8 1.8-2 0-1.4-.7-2-1.8-2-.3 0-.5 0-.8.1V30c.2.1.4.2.8.2M222.7 25.3h1.1l.1.7c.6-.5 1.3-.8 2-.8s1.3.3 1.5.9c.7-.6 1.5-.9 2.1-.9 1 0 1.9.6 1.9 2.1v3.9h-1.3v-3.5c0-.7-.1-1.3-.9-1.3-.5 0-1.1.3-1.5.7v4.2h-1.3v-3.5c0-.7-.1-1.4-.9-1.4-.5 0-1.1.3-1.5.7v4.2h-1.3v-6zM232.6 28.2c0-1.8 1-3.1 2.6-3.1s2.5 1.2 2.5 3.1v.3h-3.8c0 1 .7 1.7 1.7 1.7.6 0 1.1-.2 1.5-.4l.4.9c-.6.4-1.3.5-2 .5-2.1.1-2.9-1.4-2.9-3m3.7-.6c0-.7-.4-1.5-1.2-1.5s-1.2.7-1.3 1.5h2.5zM238.8 25.3h1.1l.1.7c.6-.5 1.3-.8 2-.8.9 0 1.8.5 1.8 2.1v3.9h-1.3v-3.5c0-.8-.2-1.4-1-1.4-.5 0-1.1.3-1.5.7v4.2h-1.3l.1-5.9zM245.9 29.8v-3.5h-1v-1h1v-1.4l1.3-.4v1.7h1.8l-.3 1h-1.4v3.3c0 .5.2.7.6.7s.7-.1.9-.3l.4.9c-.4.3-1.1.5-1.6.5-1.1 0-1.7-.6-1.7-1.5M253 23h4.3l-.3 1h-2.7v2.4h2.6v1.1h-2.6v3.6H253zM258.4 23.4c0-.4.3-.8.8-.8s.8.3.8.8c0 .4-.3.8-.8.8-.4 0-.8-.3-.8-.8m.2 1.9h1.3v5.9h-1.3v-5.9zM261.4 25.3h1.1l.1.7c.6-.5 1.3-.8 2-.8.9 0 1.8.5 1.8 2.1v3.9h-1.3v-3.5c0-.8-.2-1.4-1-1.4-.5 0-1.1.3-1.5.7v4.2h-1.3l.1-5.9zM271.3 30.5c-.4.4-1 .7-1.7.7-1.1 0-1.9-.7-1.9-1.9 0-.8.4-1.3 1-1.6.4-.2.9-.3 1.5-.3h1.1v-.2c0-.8-.5-1.1-1.2-1.1-.6 0-1.2.2-1.6.4l-.4-.9c.7-.4 1.4-.6 2.2-.6 1.5 0 2.3.7 2.3 2.1v2.4c0 .8 0 1.3.1 1.7h-1.2l-.2-.7zm-1-2.1c-.4 0-.7.1-.9.2-.3.2-.4.4-.4.7 0 .6.4.9 1 .9s1-.3 1.3-.6v-1.3l-1 .1zM273.9 25.3h1.1l.1.7c.6-.5 1.3-.8 2-.8.9 0 1.8.5 1.8 2.1v3.9h-1.3v-3.5c0-.8-.2-1.4-1-1.4-.5 0-1.1.3-1.5.7v4.2h-1.3l.1-5.9zM280.2 28.2c0-1.8 1.3-3.1 3-3.1.7 0 1.2.2 1.5.4v1.1c-.4-.3-.9-.4-1.4-.4-1.1 0-1.8.9-1.8 2 0 1.3.7 2 1.8 2 .6 0 1-.2 1.4-.4l.4.9c-.4.3-1.2.6-1.9.6-2 0-3-1.4-3-3.1M285.6 28.2c0-1.8 1-3.1 2.6-3.1s2.5 1.2 2.5 3.1v.3h-3.8c0 1 .7 1.7 1.7 1.7.6 0 1.1-.2 1.5-.4l.4.9c-.6.4-1.3.5-2 .5-2 .1-2.9-1.4-2.9-3m3.8-.6c0-.7-.4-1.5-1.2-1.5-.8 0-1.2.7-1.3 1.5h2.5z"
                    />
                  </g>
                  <g>
                    <path fill="#e9041e" d="M161.7 6.1h25.1v12.8h-25.1z" />
                    <path d="M161.7 18.6h25.1v12.5h-25.1z" />
                    <path fill="#fff" d="M166.1 17.8h16.3v1.5h-16.3z" />
                  </g>
                </svg>
              </Col>
              <Col span={8}>
                <svg
                  id="Calque_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 10 500 120"
                  style={{ height: "60px" }}
                >
                  <path
                    id="XMLID_1532_"
                    class="st0"
                    d="M103.3 17.6c1.2 5.9 3.2 11.5 6 17.3h-30l-.4.4s-.1.2-.1.3c-.1.5-.1 1-.1 1.5v64.5c1 .1 2 .3 2.9.3 13 0 25.9.1 38.9 0 8-.1 15.9-5.1 17.5-13.7 1.2-6.3 1.2-12.9-2.6-18.7-.2-.3-.4-.7-.6-.9-.4-.4-.8-.9-1.3-1.4.8-1.4 1.7-2.8 2.6-4.4 3.7 1.6 7.2 3.2 10.7 4.8 3.5 1.5 6.9 2.7 10.4 4.1-2.5 32.1-29 49.7-53.9 48.4-14.2-.7-26.4-6.7-36-17.6-8-9.2-12.3-20.1-12.6-32.2-.6-27.6 19.7-51 48.6-52.7z"
                  />
                  <path
                    id="XMLID_1531_"
                    class="st0"
                    d="M262.2 93.4h-7.9V43.5c2.9-.6 10.6-.6 14 0 2.3 11.7 4.7 23.4 7.1 35.2 3.4-11.7 5.4-23.7 8.1-35.5h14.4v50.2c-2.6.5-5.4.2-8.5.1V53.6c-2.3 2.9-2.4 6.5-3.2 9.8s-1.4 6.6-2.1 9.9c-.7 3.4-1.7 6.8-2.4 10.2-.7 3.3-1.4 6.6-2.1 10h-7.3c-1-4.5-2.1-8.9-3.2-13.4-1-4.5-2.1-8.9-3-13.4-.8-4.5-1.9-8.8-3.2-13.1-.9 3.2-.6 6.5-.6 9.7-.1 3.5 0 6.8 0 10.3v9.9c-.1 3.2-.1 6.5-.1 9.9z"
                  />
                  <path
                    id="XMLID_1527_"
                    class="st0"
                    d="M180.9 93.6V43.2c1-.1 1.9-.1 2.9-.1 4.2 0 8.3-.1 12.5 0 2.4.1 4.9.1 7.2.8 4.8 1.5 7.2 4 8 9.3.3 1.9.1 3.9-.3 5.8-.7 3.7-3.2 6.2-7 7.7 1 .4 1.8.7 2.4 1 4.4 1.8 6.2 5.2 6.3 9.7.1 2.9-.1 5.7-1.3 8.5-1.8 4-5.1 5.7-8.9 6.8-2.9.8-5.7.7-8.7.7-4.2.2-8.4.2-13.1.2zm22.5-14.9c-.3-1.2-.5-2.2-.7-3.1-.5-2.3-2-4.1-4.3-4.6-2.6-.5-5.5-.6-8.3.2 0 2.6-.1 5.1 0 7.5.1 2.5-.4 5.1.4 7.6h6.1c3.8-.4 5.3-1.7 6.2-5.5.2-.6.4-1.3.6-2.1zm-13-15.1c2.4 0 4.6.3 6.7-.1 4.6-.7 6.1-5.4 4.3-10-.7-1.9-2.3-2.9-4.1-3.2-2.2-.2-4.6-.1-6.9-.1v13.4z"
                  />
                  <path
                    id="XMLID_1524_"
                    class="st0"
                    d="M373.7 93.4h-9.8c-.7-3.5-1.5-7-2.2-10.5-2.5-.7-4.8-.3-7.1-.4-2.2-.1-4.4 0-6.9 0-.9 3.7-1.7 7.3-2.5 10.9h-9.3c-.1-.7-.2-1.2-.1-1.8 2.3-8.7 4.6-17.3 6.8-25.9 2-7.5 3.9-14.9 5.9-22.5h12c2.3 8.2 4.4 16.6 6.7 24.9 2.2 8.3 4.2 16.6 6.5 25.3zm-14-18.9c-1.7-7.8-2.9-15.2-5.3-22.5-1.1 3.7-1.8 7.5-2.6 11.2-.8 3.7-1.9 7.3-2.1 11.3h10z"
                  />
                  <path
                    id="XMLID_1523_"
                    class="st0"
                    d="M228.6 72v13.6h18.6c.5 2.7.1 5.2.3 7.9h-28c-.6-2.5-.9-43.6-.2-50.2h27.4V51h-18v12.6h16.4c.7 2.7.2 5.2.4 8.1-3 0-5.8-.1-8.6 0-2.9 0-5.7-.6-8.3.3z"
                  />
                  <path
                    id="XMLID_1520_"
                    class="st0"
                    d="M388.5 74.1v19.2h-9.3V43.2c.7-.1 1.5-.2 2.3-.2 4.9 0 9.8-.1 14.7 0 3.7.1 7.3 1 9.8 3.9 2.2 2.5 3.8 5.3 3.7 8.8-.1 3 .4 6.1-.8 9-1.8 4.6-5.1 7.3-9.8 8.2-3.3.7-6.7.8-10.6 1.2zm0-23.8v8.2c0 2.6.1 5.3.1 8.1 2.3 0 4.3.1 6.2 0 3-.1 5.3-2.3 5.5-5.3.1-1.9.1-3.9 0-5.8-.2-2.9-2.4-4.9-5.2-5.1-2.1-.2-4.1-.1-6.6-.1z"
                  />
                  <path
                    id="XMLID_1517_"
                    class="st0"
                    d="M425.2 74.1v19.2h-9c-.7-2.5-1-42.3-.3-50.2.9-.1 1.8-.1 2.8-.1 4.8 0 9.5-.1 14.3 0 3.6.1 7 1 9.5 3.7 2.3 2.6 4 5.4 3.9 9.1-.1 2.9.3 5.8-.7 8.7-1.8 4.8-5.1 7.6-10.1 8.4-3.1.7-6.5.8-10.4 1.2zm.1-7.6c2.3 0 4.3.1 6.2 0 3-.1 5.3-2.3 5.5-5.3.1-1.9.1-3.9 0-5.8-.2-2.6-1.8-4.4-4.2-4.9-2.4-.5-5-.6-7.4.1-.1 5.4-.1 10.4-.1 15.9z"
                  />
                  <path
                    id="XMLID_1516_"
                    class="st0"
                    d="M303.3 43.3H314c2.1 6.3 4.3 12.9 6.9 20.3 2.8-7.3 4.8-13.9 7.6-20.4h10.1c-1.1 2.6-2.1 5.1-3.2 7.5-3.1 7.1-6.2 14.2-9.2 21.4-.7 1.5-.8 3.3-.9 5-.1 5.4-.1 10.7-.1 16.5-1.7 0-3.2.1-4.8.1h-4.7v-7.1c0-3.3-.1-6.6 0-9.9.1-2.8-.7-5.2-1.8-7.7-3.3-8.6-6.9-17-10.6-25.7z"
                  />
                  <path
                    id="XMLID_1515_"
                    class="st0"
                    d="M89.8 90.7v-2.9-13.7c.9-.1 1.5-.2 2.3-.2h27.8c1.8 0 3.7-.1 5.4 1.5 1.8 2.5 2.1 5.6 1.8 8.8-.2 2.8-2.3 5.2-5.1 5.8-1.8.4-3.6.7-5.4.7H89.8z"
                  />
                  <path
                    id="XMLID_1514_"
                    class="st0"
                    d="M89.8 62.1V46.2c4.3-.3 8.5-.1 12.8-.1H115c3.6 3.6 6.9 7 10.4 10.6-.8 3.3-3.2 5.4-7 5.5-2.4.1-4.9 0-7.3 0-7-.1-13.9-.1-21.3-.1z"
                  />
                  <path
                    id="XMLID_1513_"
                    class="st0"
                    d="M107.5 17.9l48.4 48.4c-2.1-.8-4.6-1.5-7-2.6-7.3-3.5-14.5-6.8-20.9-11.8-4-3.2-7.4-7-10.4-11.2-4.8-6.7-7.6-14.2-10.1-22-.2-.3 0-.7 0-.8z"
                  />
                </svg>
              </Col>
              <Col span={3} />
            </Row>
            2019. Big Brother.
          </Footer>
        </Layout>
      </Fragment>
    );
  }
}

export default Home;
