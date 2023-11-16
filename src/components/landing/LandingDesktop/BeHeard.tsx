import React from "react";

const BeHeard: React.FC = () => {
  return (
    <section className="be-heard">
      <div className="row justify-content-center">
        <div className="col-12 col-md-4 text-center section-title">
          <span className="display-4"> Be Heard </span>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-7 section-info order-last order-md-first">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"> Quriosity </h5>
              <h3 className="card-title"> WRITE 2.0</h3>
              <div className="card-text">
                <ul>
                  <li>
                    Use your areas of expertise to remove boundaries while
                    helping others across the globe.
                  </li>
                  <br />
                  <li>
                    Get people thinking critically about the topics that matter
                    by click of a button.
                  </li>
                  <br />
                  <li>
                    Target your audience to make sure your efforts aren’t
                    wasted.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-5 order-first order-md-last text-center">
          <img src="./img/desktopAssets/be_heard.png" alt="be heard" />
        </div>
      </div>
    </section>
  );
};

export default BeHeard;
