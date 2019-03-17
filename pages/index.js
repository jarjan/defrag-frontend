import React, { Component, Fragment } from "react";
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
  Col
} from "antd";
import axios from "axios";
import "antd/dist/antd.css";
import "../static/style.css";

const { Step } = Steps;
const { Item } = Form;
const { TabPane } = Tabs;

import Head from "../components/head";
import Header from "../components/header";
import Footer from "../components/footer";
import Logo from "../components/logo";
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
          <Header active="1" />
          <Layout.Content>
            <Card style={{ maxWidth: 600, margin: "auto", paddingTop: 20 }}>
              <Logo />
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
          </Layout.Content>
          <Footer />
        </Layout>
      </Fragment>
    );
  }
}

export default Home;
