import React from "react";

const Introduction: React.FC = () => {
  return (
    <section className="introduction">
      <div className="row justify-content-center text-center p-4">
        <div className="col-12">
          <span className="display-2" id="title-Q">
            Q
          </span>
          <span className="display-2" id="title-rest">
            alki
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h3 style={{ fontWeight: "bold" }}>Be Curious. Be Heard. Be You.</h3>
        </div>
      </div>
      <div className="container card">
        <div className="row">
          <div className="col-12 text-center mb-4 mt-4">
            <span style={{ fontSize: "18px" }}>
              Leverge the three most important qualities that make us human:
              curiosity, empathy and creativity
            </span>
          </div>
        </div>
        <div className="row text-center">
          <div className="col">
            <div className="row">
              <div className="col-12">
                <img
                  src="./img/desktopAssets/person.jpg"
                  alt="person icon"
                  className="src"
                  style={{ background: "transparent" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">Self-Respect</div>
            </div>
          </div>
          <div className="col">
            <div className="row">
              <div className="col-12">
                <img
                  src="./img/desktopAssets/leaf.jpg"
                  alt="leaf icon"
                  className="src"
                  style={{ background: "transparent" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">Self-Respect</div>
            </div>
          </div>
          <div className="col">
            <div className="row">
              <div className="col-12">
                <img
                  src="./img/desktopAssets/earth.jpg"
                  alt="earth icon"
                  className="src"
                  style={{ background: "transparent" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">Self-Respect</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
