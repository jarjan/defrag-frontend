import React, { Component } from "react";
import Webcam from "react-webcam";

class WebcamCapture extends Component {
  state = {
    videoConstraints: {
      width: 1280,
      height: 720
    },
    imageSrc: null,
    webcam: null
  };

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();

    this.setState({ imageSrc });
  };

  render() {
    const { imageSrc, videoConstraints } = this.state;
    return (
      <div>
        <p>Take a photo:</p>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
        />
        <br />
        <button onClick={this.capture}>Capture photo</button>
        <hr />
        <img src={imageSrc} />
      </div>
    );
  }
}

export default WebcamCapture;
