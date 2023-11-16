import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { logIn, RootState } from "../../../redux";
import Spinner from "../../helperComponents/Spinner";
import { PersonIcon, LockIcon } from "../../helperComponents/svgIcons";

interface SignInProps {
  isRequestActive: boolean;
  logIn: (email: string, password: string) => Promise<boolean>;
}

const SignIn: React.FC<SignInProps> = ({ isRequestActive, logIn }) => {
  const [loginValues, updateLoginValues] = useState({
    email: "",
    password: "",
  });

  const { email, password } = loginValues;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateLoginValues({ ...loginValues, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isLoggedIn = await logIn(email, password);
    isLoggedIn && history.push("/home");
  };
  const history = useHistory();
  return (
    <>
      <h1>
        Welcome to Qalki<span>!</span>
      </h1>

      <div className="buttons">
        <Link to="/sign-in/login">
          <div className="btn btn-round btn-primary">Log In</div>
        </Link>
        <Link to="/sign-in/register">
          <div className="btn btn-round btn-secondary">Register</div>
        </Link>
      </div>
      {/* ONLY VISIBLE ABOVE 1200px */}
      <form
        className="form-control sign-in-login-form"
        id="sign-in-login-form"
        action=""
        onSubmit={(e) => onSubmit(e)}
      >
        <div className="input-control">
          <div className="icon">
            <PersonIcon />
          </div>
          <input
            type="text"
            name="email"
            autoComplete="username"
            placeholder="Email"
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="input-control">
          <div className="icon">
            <LockIcon />
          </div>
          <input
            type="password"
            name="password"
            autoComplete="password"
            placeholder="Password"
            onChange={(e) => onChange(e)}
          />
        </div>
        <Link to="/sign-in/forgot-password">Forgot Password?</Link>

        <div className="form-buttons">
          <button className="btn btn-primary" form="sign-in-login-form">
            {isRequestActive ? <Spinner /> : "Log In"}
          </button>
          <Link to="/sign-in/register">
            <div className="btn btn-round btn-secondary">Register</div>
          </Link>
        </div>
      </form>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  isRequestActive: state.appState.isRequestActive,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  logIn: (email: string, password: string) => dispatch(logIn(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
