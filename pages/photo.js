import React, { Component } from "react";
import Webcam from "react-webcam";

class Photo extends Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    console.log(imageSrc);
  };

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: { exact: "environment" }
    };
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
        <button onClick={this.capture}>Capture photo</button>
      </div>
    );
  }
}

export default Photo;
