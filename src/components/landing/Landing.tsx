import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Footer from "./Footer";
import { connect } from "react-redux";
import { RootState } from "../../redux";

interface LandingProps {
  loggedIn: boolean;
}

const Landing: React.FC<LandingProps> = ({ loggedIn }) => {
  useEffect(() => {
    const loadTime = setTimeout(() => {
      loggedIn ? history.push("/home") : history.push("/sign-in");
    }, 2000);

    return () => {
      clearTimeout(loadTime);
    };
  });

  const history = useHistory();
  return (
    <div className="landing">
      <h1 className="logo">Q</h1>
      <p className="landing-text">
        <span>Be </span>Qurious
      </p>
      <Footer landing={true} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.user.loggedIn,
});

export default connect(mapStateToProps, null)(Landing);
