import React, { Component } from "react";
import Webcam from "react-webcam";
import { Button } from "antd";

class WebcamCapture extends Component {
  state = {
    back: {
      width: 1280,
      height: 720
      // facingMode: { exact: "environment" }
    },
    front: {
      width: 1280,
      height: 720,
      facingMode: { exact: "user" }
    },
    isBack: true,
    imageSrc: null,
    webcam: null
  };

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();

    this.setState({ imageSrc });
    this.props.onChange(imageSrc);
  };

  changeCamera = () => {
    this.setState({ isBack: !this.state.isBack });
  };

  render() {
    const { imageSrc, isBack, front, back } = this.state;
    return (
      <div onClick={this.capture}>
        <Webcam
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={isBack ? back : front}
        />
        <br />
        <Button icon="camera" size="large">
          Capture photo
        </Button>
        {/* <Button onClick={this.changeCamera}>Change camera</Button> */}
      </div>
    );
  }
}

export default WebcamCapture;
