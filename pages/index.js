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
      { title: "Result", icon: <Icon type="profile" /> }
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
              <Row style={{ minHeight: 60, margin: "auto" }}>
                <Col span={24}>
                  <svg
                    id="Calque_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="120 0 300 60"
                  >
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
              </Row>
              <Steps labelPlacement="vertical" style={{ padding: 20 }}>
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
            2019. Big Brother.
          </Footer>
        </Layout>
      </Fragment>
    );
  }
}

export default Home;
