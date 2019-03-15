import React, { Component } from "react";
import Webcam from "react-webcam";

class Photo extends Component {
  render() {
    return (
      <div>
        <p>Webcam:</p>
        <Webcam />
      </div>
    );
  }
}

export default Photo;
