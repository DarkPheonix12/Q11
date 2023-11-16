import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { addBetaUser } from "../../../helperFunctions/firebaseUserActions";

const Landing: React.FC = () => {
  const [daysRemaining, updateDaysRemaining] = useState("");
  const [hoursRemaining, updateHoursRemaining] = useState("");

  const [signUpEmail, changeSignUpEmail] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addBetaUser(signUpEmail);
  };

  useEffect(() => {
    calculateTime();
    const calcTimeInterval = setInterval(() => calculateTime(), 60000);
    return () => clearInterval(calcTimeInterval);
  });

  const calculateTime = (): void => {
    const now = new Date().getTime();
    const timeleft = releaseDate - now;
    updateDaysRemaining(
      Math.floor(timeleft / (1000 * 60 * 60 * 24)).toString()
    );
    updateHoursRemaining(
      Math.floor(
        (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ).toString()
    );
  };

  const releaseDate = new Date("Jul 31, 2021").getTime();
  const history = useHistory();
  return (
    <section className="landing-desktop">
      <div className="row content">
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <div className="buttons">
                <div
                  className="btn btn-primary"
                  onClick={() => history.push("/sign-in")}
                >
                  Log In
                </div>
                <div
                  className="btn btn-secondary"
                  onClick={() => history.push("/sign-in/register")}
                >
                  Register
                </div>
              </div>
              <span id="q" className="display-2">
                Q
              </span>
              <br />
              <span
                className="display-4 introducing"
                style={{ fontWeight: "bold" }}
              >
                Introducing
              </span>{" "}
              <h2>A new way to be at peace</h2> <br />
              <p style={{ fontSize: "22px" }}>
                One-stop platform to grow within ourselves,
                <br /> with loved ones and create impact
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md- offset-md-2"></div>
      </div>

      <div className="row justify-content-center sign-up p-3">
        <div className="col-12 text-center">
          <div id="countdown">
            <span className="display-3">{daysRemaining}</span>
            <span>Days</span> &nbsp;
            <span className="display-3">{hoursRemaining}</span>
            <span>Hours</span> <br />
          </div>
          <p>
            Sign up to build the most passionate community to cause change for
            our BETA release!
          </p>
          <form
            onSubmit={(e) => onSubmit(e)}
            className="form-inline mt-1"
            style={{ display: "inherit" }}
          >
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Email Address"
              name="email"
              onChange={(e) => changeSignUpEmail(e.target.value)}
            />
            <button type="submit" className="btn sign-up-button mt-1">
              IMPACT
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Landing;
