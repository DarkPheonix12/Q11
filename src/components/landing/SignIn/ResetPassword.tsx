import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { firebaseAuth } from "../../../firebase";
import { getNotificationMessage } from "../../../helperFunctions/customNotificationMessages";
import { customFirebaseErrorMessage } from "../../../helperFunctions/firestoreErrorHandler";
import {
  setRequestActive,
  logIn,
  Notification,
  RootState,
  setNotification,
} from "../../../redux";
import Spinner from "../../helperComponents/Spinner";
import { LockIcon } from "../../helperComponents/svgIcons";

interface ResetPasswordProps {
  isRequestActive: boolean;
  setNotification: typeof setNotification;
  logIn: (email: string, password: string) => Promise<boolean>;
  changeRequestActive: typeof setRequestActive;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  isRequestActive,
  setNotification,
  logIn,
  changeRequestActive,
}) => {
  const location = useLocation();
  const history = useHistory();

  const [passwordValues, updatePasswordValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { newPassword, confirmPassword } = passwordValues;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePasswordValues({
      ...passwordValues,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length === 0)
      setNotification({ text: getNotificationMessage("new-password-empty") });
    else if (confirmPassword.length === 0)
      setNotification({
        text: getNotificationMessage("confirm-password-empty"),
      });
    else if (newPassword !== confirmPassword)
      setNotification({
        text: getNotificationMessage("passwords-not-matching"),
      });
    else handlePasswordReset();
  };

  const handlePasswordReset = async () => {
    changeRequestActive(true);
    if (
      location.search.match("mode") &&
      location.search.match("resetPassword") &&
      location.search.match("oobCode")
    ) {
      const params = location.search.split("&");
      const mode = params[0].split("=")[1];
      const oobCode = params[1].split("=")[1];
      if (mode === "resetPassword") {
        try {
          const email = await firebaseAuth.verifyPasswordResetCode(oobCode);
          try {
            await firebaseAuth.confirmPasswordReset(oobCode, newPassword);
            const isLoggedIn = await logIn(email, newPassword);

            if (isLoggedIn) {
              setNotification({
                text: getNotificationMessage("password-reset-success"),
              });
              history.push("/home");
            }
          } catch (err) {
            setNotification({ text: customFirebaseErrorMessage(err) });
            changeRequestActive(false);
            console.error(err);
          }
        } catch (err) {
          setNotification({ text: customFirebaseErrorMessage(err) });
          changeRequestActive(false);
          console.error(err);
        }
      }
    } else {
      setNotification({
        text: getNotificationMessage("email-for-password-reset"),
      });
      changeRequestActive(false);
      history.push("/sign-in/forgot-password");
    }
  };

  // redirect to /forgot-password if user accesses this page without proper params
  useEffect(() => {
    if (
      location.search.match("mode") &&
      location.search.match("resetPassword") &&
      location.search.match("oobCode")
    ) {
      const params = location.search.split("&");
      const mode = params[0].split("=")[1];

      if (mode !== "resetPassword") {
        setNotification({
          text: getNotificationMessage("email-for-password-reset"),
        });
        // history.push("/sign-in/forgot-password");
      }
    } else {
      setNotification({
        text: getNotificationMessage("email-for-password-reset"),
      });
      // history.push("/sign-in/forgot-password");
    }
  }, [history, location.search, setNotification]);

  return (
    <div className="login">
      <form
        className="form-control login-form"
        action=""
        onSubmit={(e) => onSubmit(e)}
      >
        <div className="input-control">
          <div className="icon">
            <LockIcon />
          </div>
          <input
            type="password"
            name="newPassword"
            autoComplete="new-password"
            placeholder="New Password"
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="input-control">
          <div className="icon">
            <LockIcon />
          </div>
          <input
            type="password"
            name="confirmPassword"
            autoComplete="confirm-password"
            className="mb-4"
            placeholder="Confirm New Password"
            onChange={(e) => onChange(e)}
          />
        </div>
        <button className="btn btn-primary" disabled={isRequestActive}>
          {isRequestActive ? <Spinner /> : "Submit"}
        </button>
        <div
          className="btn btn-transparent"
          onClick={() => history.push("/sign-in/forgot-password")}
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
  setNotification: (newNotification: Notification) =>
    dispatch(setNotification(newNotification)),
  logIn: (email: string, password: string) => dispatch(logIn(email, password)),
  changeRequestActive: (isActive: boolean) =>
    dispatch(setRequestActive(isActive)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
