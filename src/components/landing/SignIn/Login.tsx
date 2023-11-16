import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { logIn } from "../../../redux";
import { RootState } from "../../../redux/rootReducer";
import Spinner from "../../helperComponents/Spinner";
import { LockIcon, PersonIcon } from "../../helperComponents/svgIcons";

interface LoginProps {
  isRequestActive: boolean;
  logIn: (email: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ logIn, isRequestActive }) => {
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
    <div className="login">
      <form
        className="form-control login-form"
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
            autoComplete="current-password"
            placeholder="Password"
            onChange={(e) => onChange(e)}
          />
        </div>
        <Link to="/sign-in/forgot-password">Forgot Password?</Link>
        <button className="btn btn-primary" disabled={isRequestActive}>
          {isRequestActive ? <Spinner /> : "Log In"}
        </button>
        <div
          className="btn btn-transparent"
          onClick={() => history.push("/sign-in")}
        >
          Go Back
        </div>
      </form>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
