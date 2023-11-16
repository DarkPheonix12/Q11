import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Dispatch } from "redux";
import { getNotificationMessage } from "../../../helperFunctions/customNotificationMessages";
import { changePassword } from "../../../helperFunctions/firebaseUserActions";
import { Notification, RootState, setNotification } from "../../../redux";
import Spinner from "../../helperComponents/Spinner";
import { LockIcon } from "../../helperComponents/svgIcons";

interface ChangePasswordProps {
  isRequestActive: boolean;
  setNotification: typeof setNotification;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  isRequestActive,
  setNotification,
}) => {
  const [passwordValues, updatePasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { currentPassword, newPassword, confirmPassword } = passwordValues;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePasswordValues({
      ...passwordValues,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword.length === 0)
      setNotification({
        text: getNotificationMessage("current-password-empty"),
      });
    else if (newPassword.length === 0)
      setNotification({ text: getNotificationMessage("new-password-empty") });
    else if (confirmPassword.length === 0)
      setNotification({
        text: getNotificationMessage("confirm-password-empty"),
      });
    else if (newPassword !== confirmPassword)
      setNotification({
        text: getNotificationMessage("passwords-not-matching"),
      });
    else if (currentPassword === newPassword)
      setNotification({ text: getNotificationMessage("passwords-same") });
    else {
      const passwordChanged = await changePassword(passwordValues);
      if (passwordChanged) history.push("/home");
    }
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
            <LockIcon />
          </div>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            onChange={(e) => onChange(e)}
          />
        </div>
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
            autoComplete="new-password"
            className="mb-4"
            placeholder="Confirm New Password"
            onChange={(e) => onChange(e)}
          />
        </div>
        <button className="btn btn-primary" disabled={isRequestActive}>
          {isRequestActive ? <Spinner /> : "Submit"}
        </button>
        <div className="btn btn-transparent" onClick={() => history.goBack()}>
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
  setNotification: (newNotification: Notification) =>
    dispatch(setNotification(newNotification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
