import React from "react";

const BeCurious: React.FC = () => {
  return (
    <section className="be-curious">
      <div className="row justify-content-center">
        <div className="col-12 text-center section-title">
          <span className="display-4"> Be Curious </span>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-5 text-center">
          <img src="./img/desktopAssets/be_curious.png" alt="be curious" />
        </div>
        <div className="col-12 col-md-6 section-info">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"> Grow </h5>
              <h3 className="card-title"> READ 2.0</h3>
              <div className="card-text">
                <ul>
                  <li>
                    Build self-awareness by pondering upon the questions that
                    matter the most.
                  </li>
                  <br />
                  <li>
                    Step in shoes of great visioniaries as we dive into stories
                    of hardships, success and much more.
                  </li>
                  <br />
                  <li>
                    Use vulnerability as a strength by creating your own
                    personal secure diary.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeCurious;
