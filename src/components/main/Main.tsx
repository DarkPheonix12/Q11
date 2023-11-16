import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../helperComponents/PrivateRoute";
import Discuss from "./discuss/Discuss";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./home/Home";
import Library from "./library/Library";
import Profile from "./profile/Profile";
import ProfileFollowers from "./profile/ProfileFollowers";
import UserCreations from "./userCreations/UserCreations";
import NotificationSettings from "./userSettings/NotificationSettings";
import UserSettings from "./userSettings/UserSettings";

const Main: React.FC = () => {
  return (
    <>
      <Header />
      <Route exact path="/home" component={Home} />
      <PrivateRoute exact path="/home/library" component={Library} />
      <Route path="/home/discuss" component={Discuss} />
      <PrivateRoute exact path="/home/profile" component={Profile} />
      <PrivateRoute
        path={"/home/profile/follow"}
        component={ProfileFollowers}
      />
      <PrivateRoute path={"/home/your-creations"} component={UserCreations} />
      <PrivateRoute
        path={"/home/notifications"}
        component={NotificationSettings}
      />
      <PrivateRoute path={"/home/settings"} component={UserSettings} />
      <Route path="/home/user/:username" component={Profile} />
      <Footer />
    </>
  );
};

export default Main;
