import React, { useState } from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "../../helperComponents/PrivateRoute";
import CreateMenu from "../home/CreateMenu/CreateMenu";
import UserCreationsMenu from "./userCreationsViews/UserCreationsMenu";
import UserCreationsPublished from "./userCreationsViews/UserCreationsPublished";
import UserCreationsUnpublished from "./userCreationsViews/UserCreationsUnpublished";

const UserCreations: React.FC = () => {
  const [showCreateMenu, toggleCreateMenu] = useState(false);
  return (
    <>
      <UserCreationsMenu />
      <section
        className={`user-creations${showCreateMenu ? " create-menu-open" : ""}`}
      >
        <Switch>
          <PrivateRoute
            exact
            path="/home/your-creations/published"
            component={UserCreationsPublished}
          />
          <PrivateRoute
            exact
            path="/home/your-creations/unpublished"
            component={UserCreationsUnpublished}
          />
        </Switch>
      </section>
      <CreateMenu
        showCreateMenu={showCreateMenu}
        toggleCreateMenu={toggleCreateMenu}
      />
    </>
  );
};

export default UserCreations;
