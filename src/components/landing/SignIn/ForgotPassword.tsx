import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  setNotification,
  Notification,
  setRequestActive,
  RootState,
} from "../../../redux";
import { Dispatch } from "redux";
import { CheckmarkIcon, PersonIcon } from "../../helperComponents/svgIcons";
import { firebaseAuth } from "../../../firebase";
import { customFirebaseErrorMessage } from "../../../helperFunctions/firestoreErrorHandler";
import { getNotificationMessage } from "../../../helperFunctions/customNotificationMessages";
import Spinner from "../../helperComponents/Spinner";

interface ForgotPasswordProps {
  isRequestActive: boolean;
  setNotification: typeof setNotification;
  changeRequestActive: typeof setRequestActive;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  isRequestActive,
  setNotification,
  changeRequestActive,
}) => {
  const [email, changeEmail] = useState<{ email: string }>({ email: "" });
  const [isValid, changeIsValid] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeEmail({ ...email, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    changeRequestActive(true);
    if (
      !email.email.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      setNotification({ text: getNotificationMessage("invalid-email") });
      changeRequestActive(false);
    } else {
      try {
        await firebaseAuth.sendPasswordResetEmail(email.email);
        changeIsValid(true);
        setNotification({
          text: getNotificationMessage("if-account-email-exists"),
        });
        changeRequestActive(false);
      } catch (err) {
        setNotification({ text: customFirebaseErrorMessage(err) });
        changeRequestActive(false);
        console.error(err);
      }
    }
  };

  const history = useHistory();
  return (
    <div className="login">
      <form
        className="form-control login-form forgot-password"
        action=""
        onSubmit={(e) => onSubmit(e)}
      >
        <div className="input-control">
          <div className="icon">
            <PersonIcon />
            {isValid && <CheckmarkIcon />}
          </div>
          <input
            type="text"
            name="email"
            autoComplete="username"
            placeholder="Enter Email to Recover Password"
            onChange={(e) => onChange(e)}
          />
        </div>
        <button className="btn btn-primary" disabled={isRequestActive}>
          {isRequestActive ? <Spinner /> : "Submit"}
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeRequestActive: (isActive: boolean) =>
    dispatch(setRequestActive(isActive)),
  setNotification: (newNotification: Notification) =>
    dispatch(setNotification(newNotification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
