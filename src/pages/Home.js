import React, { useEffect } from "react";
import "./Home.css";
import { NavLink } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const HomePage = () => {
  return (
    <div className="home-container">
      <h1 className="home-heading">Introducing Narad</h1>
      <TypeAnimation
        sequence={[
          // Same substring at the start will only be typed out once, initially
          "A Conversational AI",
          1000,
          "Powered by Recommendations with RLHF",
          1000,
        ]}
        wrapper="p"
        speed={25}
        style={{ fontSize: "2em", display: "inline-block" }}
        repeat={Infinity}
      />
      <p className="narad-text">
        A conversational AI that seamlessly blends voice and text
        <br />
        inputs to tap into Bhuvan's wealth of data, sparking ideas, <br />
        navigating insights, and fostering intuitive interactions.
      </p>
      <NavLink to="/chatbot" className="launch-btn">
        Launch Now.
      </NavLink>
    </div>
  );
};

export default HomePage;
