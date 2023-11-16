import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { registerUser } from "../../../redux";
import { RootState } from "../../../redux/rootReducer";
import Spinner from "../../helperComponents/Spinner";
import { AtIcon, LockIcon, PersonIcon } from "../../helperComponents/svgIcons";

interface RegisterProps {
  isRequestActive: boolean;
  registerUser: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
}

interface RegisterValues {
  name: string;
  username: string;
  email: string;
  password: string;
}

const Register: React.FC<RegisterProps> = ({
  registerUser,
  isRequestActive,
}) => {
  const [registerValues, updateRegisterValues] = useState<RegisterValues>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const { name, username, email, password } = registerValues;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateRegisterValues({
      ...registerValues,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerUser(name, username, email, password);
    result && history.push("/home");
  };

  const history = useHistory();
  return (
    <>
      <div className="register">
        <h1>
          Welcome to Qalki<span>!</span>
        </h1>
        <form
          className="form-control register-form"
          action=""
          onSubmit={(e) => onSubmit(e)}
        >
          <div className="input-control">
            <div className="icon">
              <PersonIcon />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="input-control">
            <div className="icon">
              <AtIcon />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => onChange(e)}
            />
          </div>
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
              autoComplete="new-password"
              className="mb-2"
              placeholder="Password"
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="buttons">
            <button
              className="btn btn-secondary-lighter"
              disabled={isRequestActive}
            >
              {isRequestActive ? <Spinner /> : "Register"}
            </button>
            <Link to="/sign-in">
              <div className="btn btn-primary">Login</div>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  isRequestActive: state.appState.isRequestActive,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  registerUser: (
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<boolean> =>
    dispatch(registerUser(name, username, email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
