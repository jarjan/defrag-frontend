import React, { Component, Fragment } from "react";
import Link from "next/link";
import { Button, Card, Input, Layout, Steps, Icon } from "antd";
import "antd/dist/antd.css";

const { Step } = Steps;
const { Header, Footer, Content } = Layout;

import Head from "../components/head";

class Home extends Component {
  state = {
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

  render() {
    const { currentStep, steps } = this.state;
    return (
      <Fragment>
        <Head title="Home" />
        <Layout>
          <Header>Header</Header>
          <Content style={{ padding: "20px 50px" }}>
            <Steps style={{ background: "#fff", padding: 24 }}>
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
              <Card>
                Input company name:
                <Input />
                <Button onClick={this.goPrev}>Prev</Button>
                <Button onClick={this.goNext}>Next</Button>
              </Card>
            )}

            {currentStep === 1 && (
              <Card>
                Doing some verification
                <Button onClick={this.goPrev}>Prev</Button>
                <Button onClick={this.goNext}>Next</Button>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                Doing some check
                <Button onClick={this.goPrev}>Prev</Button>
                <Button onClick={this.goNext}>Next</Button>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                Here is result
                <Button onClick={this.goPrev}>Prev</Button>
                <Button onClick={this.goNext}>Next</Button>
              </Card>
            )}
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
