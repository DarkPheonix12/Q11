import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect, useLocation } from "react-router-dom";
import { Dispatch } from "redux";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";
import { RootState, setNotification, Notification } from "../../redux";
import Spinner from "./Spinner";

interface PrivateRouteProps {
  loggedIn: boolean;
  appLoading: boolean;
  component: React.FC<any>;
  setNotification: typeof setNotification;
  path: string;
  exact?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  loggedIn,
  appLoading,
  path,
  exact,
  setNotification,
  ...rest
}) => {
  const location = useLocation();

  useEffect(() => {
    if (!appLoading && !loggedIn && path === location.pathname)
      setNotification({
        text: getNotificationMessage("login-required"),
      });
  }, [location.pathname, path, appLoading, loggedIn, setNotification]);
  return (
    <Route
      path={path}
      exact={exact || false}
      {...rest}
      render={(props) =>
        !appLoading ? (
          loggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect to="/sign-in/register" />
          )
        ) : (
          <Spinner h100={!!location.pathname.match(/edit/)} />
        )
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.user.loggedIn,
  appLoading: state.appState.loading,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setNotification: (notification: Notification) =>
    dispatch(setNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
