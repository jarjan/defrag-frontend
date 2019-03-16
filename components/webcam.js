import React, { Component } from "react";
import Webcam from "react-webcam";
import { Button } from "antd";

class WebcamCapture extends Component {
  state = {
    back: {
      width: 1280,
      height: 720
    },
    front: {
      width: 1280,
      height: 720,
      facingMode: { exact: "environment" }
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
      <div>
        <Button onClick={this.capture}>Capture photo</Button>
        <Button onClick={this.changeCamera}>Change camera</Button>
        <Webcam
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={isBack ? back : front}
        />
      </div>
    );
  }
}

export default WebcamCapture;
