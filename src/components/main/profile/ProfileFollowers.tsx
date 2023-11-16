import React from "react";
import { Route, Switch } from "react-router-dom";
import ProfileFollowersMenu from "./profileViews/ProfileFollowersMenu";
import UserFollowers from "./profileViews/UserFollowers";
import UserFollowing from "./profileViews/UserFollowing";

interface ProfileFollowersProps {}

const ProfileFollowers: React.FC<ProfileFollowersProps> = ({}) => {
  return (
    <section className="profile-followers">
      <ProfileFollowersMenu />
      <Switch>
        <Route
          exact
          path="/home/profile/follow/following"
          component={UserFollowing}
        />
        <Route
          exact
          path="/home/profile/follow/followers"
          component={UserFollowers}
        />
      </Switch>
    </section>
  );
};

export default ProfileFollowers;
