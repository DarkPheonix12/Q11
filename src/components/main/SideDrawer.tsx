import { connect } from "react-redux";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { logOut, RootState } from "../../redux";
import {
  Cogwheel,
  CreationsIcon,
  LogoutIcon,
  NotificationsIcon,
  ReportIcon,
} from "../helperComponents/svgIcons";
import UserImageRounded from "../helperComponents/UserImageRounded";

interface SideDrawerProps {
  hideMenu: boolean;
  userAvatar: string;
  userFullName: string;
  userEmail: string;
  loggedIn: boolean;
  toggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
  logOut: () => Promise<boolean>;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  hideMenu,
  toggleMenu,
  logOut,
  userAvatar,
  userFullName,
  userEmail,
  loggedIn,
}) => {
  const history = useHistory();
  const path = useLocation().pathname;
  return (
    <>
      <div
        className={`side-drawer-mask${hideMenu ? "" : " drawer-open"}`}
      ></div>
      <section className={`side-drawer${hideMenu ? "" : " drawer-open"}`}>
        <div className="drawer-container">
          <div className="user-info">
            <div className="user-info-cover">
              <img
                src="/img/icons/drawer-img.svg"
                alt="Side Drawer User Info Cover"
              />
            </div>
            <div className="user-info-content">
              <UserImageRounded src={userAvatar} alt={userFullName} />
              <h2 className="full-name">{userFullName || "anonymous"}</h2>
              <h2 className="user-email">
                {userEmail || "example@google.com"}
              </h2>
            </div>
          </div>

          <div className="drawer-navigation">
            {loggedIn && (
              <>
                <div
                  className={`drawer-item${
                    path.match("/your-creations") ? " current" : ""
                  }`}
                  onClick={() => {
                    toggleMenu(!hideMenu);
                    history.push("/home/your-creations/published");
                  }}
                >
                  <div className="drawer-item-icon">
                    <CreationsIcon />
                  </div>
                  <h2>Creations</h2>
                </div>

                <div
                  className={`drawer-item${
                    path.match("/home/notifications") ? " current" : ""
                  }`}
                  onClick={() => {
                    toggleMenu(!hideMenu);
                    history.push("/home/notifications");
                  }}
                >
                  <div className="drawer-item-icon">
                    <NotificationsIcon />
                  </div>
                  <h2>Notifications</h2>
                </div>

                <div
                  className={`drawer-item${
                    path.match("/home/settings") ? " current" : ""
                  }`}
                  onClick={() => {
                    toggleMenu(!hideMenu);
                    history.push("/home/settings");
                  }}
                >
                  <div className="drawer-item-icon">
                    <Cogwheel />
                  </div>
                  <h2>Settings</h2>
                </div>
              </>
            )}

            <div className="drawer-footer">
              <div
                className="drawer-item"
                onClick={() => {
                  toggleMenu(!hideMenu);
                  history.push("#!");
                }}
              >
                <div className="drawer-item-icon">
                  <ReportIcon />
                </div>
                <h2>Report a Problem</h2>{" "}
              </div>

              <div
                className="drawer-item"
                onClick={() => {
                  toggleMenu(!hideMenu);
                  loggedIn ? logOut() : history.push("/sign-in/login");
                  loggedIn && history.push("/sign-in");
                }}
              >
                <div className="drawer-item-icon">
                  <LogoutIcon />
                </div>
                <h2>{loggedIn ? "Log Out" : "Log In"}</h2>{" "}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  userAvatar: state.user.profileAvatar,
  userFullName: state.user.name,
  userEmail: state.user.email,
  loggedIn: state.user.loggedIn,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  logOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
