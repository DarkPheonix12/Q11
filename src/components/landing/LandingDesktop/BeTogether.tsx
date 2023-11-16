import React from "react";

const BeTogether: React.FC = () => {
  return (
    <section className="be-together">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 text-center section-title">
          <span className="display-4"> Be Together </span>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-4 text-center">
          <img
            src="./img/desktopAssets/be_together.png"
            alt="Be Together"
            style={{
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}
          />
        </div>
        <div className="col-12 col-md-7 offset-md-1 section-info">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"> Impact </h5>
              <h3 className="card-title"> LIBRARY 2.0</h3>
              <div className="card-text">
                <ul>
                  <li>
                    Become a life coach by creatively sharing how you overcame
                    hardships and tackled obstacles - inspire others.
                  </li>
                  <br />
                  <li>
                    Dive into worlds other than your own, and live a thousand
                    lifetimes at your comfort.
                  </li>
                  <br />
                  <li>We are all waiting to read your story!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeTogether;
