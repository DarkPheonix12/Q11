import React from "react";
import { Route, Switch } from "react-router-dom";
import Circles from "./SignIn/Circles";
import Header from "./Header";
import Login from "./SignIn/Login";
import SignIn from "./SignIn/SignIn";
import ForgotPassword from "./SignIn/ForgotPassword";
import ResetPassword from "./SignIn/ResetPassword";
import Register from "./SignIn/Register";
import Footer from "./Footer";
import PrivateRoute from "../helperComponents/PrivateRoute";
import ChangePassword from "./SignIn/ChangePassword";

interface SignInViewProps {}

const SignInView: React.FC<SignInViewProps> = () => {
  return (
    <>
      <Circles />
      <Header />
      <div className="sign-in-container">
        <section className="sign-in">
          <Switch>
            <Route exact path="/sign-in" component={SignIn} />
            <Route exact path="/sign-in/login" component={Login} />
            <Route
              exact
              path="/sign-in/forgot-password"
              component={ForgotPassword}
            />
            <Route
              exact
              path="/sign-in/reset-password"
              component={ResetPassword}
            />
            <Route exact path="/sign-in/register" component={Register} />
            <PrivateRoute
              exact
              path="/sign-in/change-password"
              component={ChangePassword}
            />
          </Switch>
        </section>
      </div>
      <Route
        exact
        path={["/sign-in", "/sign-in/register"]}
        component={Footer}
      />
    </>
  );
};

export default SignInView;
