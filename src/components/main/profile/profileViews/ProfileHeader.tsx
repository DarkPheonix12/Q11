import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getTimeFromSeconds, formatNumbers } from "../../../../helperFunctions";
import { getNotificationMessage } from "../../../../helperFunctions/customNotificationMessages";
import { setNotification } from "../../../../redux";
import { AddImageIcon, ShareIcon } from "../../../helperComponents/svgIcons";
import UserImageRounded from "../../../helperComponents/UserImageRounded";

interface ProfileHeaderProps {
  profileAvatar: string;
  fullName: string;
  numberOfPublishedPosts: number;
  followersCount: number;
  joined: string;
  readTime: number;
  totalTimeOfAllPosts: number;
  lastActive: string | null;
  showFollowButton: boolean;
  addImgClick: () => void;
  handleFollow: () => Promise<void>;
  handleShare: () => void;
  setNotification: typeof setNotification;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileAvatar,
  followersCount,
  numberOfPublishedPosts,
  fullName,
  joined,
  readTime,
  totalTimeOfAllPosts,
  lastActive,
  showFollowButton,
  addImgClick,
  handleFollow,
  handleShare,
  setNotification,
}) => {
  const location = useLocation();
  const history = useHistory();
  const currentUserProfile =
    location.pathname === "/home/profile" ? true : false;
  return (
    <>
      <div className="profile-header">
        <div className="cover">
          <img
            src={profileAvatar || "/img/icons/drawer-img.svg"}
            alt={fullName}
          />
        </div>
        <div className="profile-buttons">
          <div className="share icon" onClick={() => handleShare()}>
            <ShareIcon />
          </div>
          {currentUserProfile && (
            <div className="add-image icon" onClick={() => addImgClick()}>
              <AddImageIcon />
            </div>
          )}
        </div>

        <div className="user-img">
          <UserImageRounded src={profileAvatar} alt={fullName} />
          {showFollowButton && (
            <div
              className="follow-user-button-container"
              onClick={() => handleFollow()}
            >
              <div className="follow-user-button"></div>
            </div>
          )}
        </div>
        <h1 className="user-full-name">{fullName}</h1>
        <div className="user-stats">
          <div className="posts">
            <div className="number-of-posts">
              {formatNumbers(numberOfPublishedPosts)}
            </div>
            <p>posts</p>
          </div>
          <div
            className="followers"
            onClick={() =>
              currentUserProfile &&
              history.push("/home/profile/follow/followers")
            }
          >
            <div className="number-of-followers">
              {formatNumbers(followersCount)}
            </div>
            <p>followers</p>
          </div>
        </div>
        <div className="user-header-info">
          Joined {joined}
          {lastActive ? `, last active ${lastActive}` : ""}
        </div>
      </div>
      <div className="read-time-contributions">
        <div
          className="read-time-container"
          onClick={() =>
            setNotification({ text: getNotificationMessage("user-read-time") })
          }
        >
          <div className="read-time">{getTimeFromSeconds(readTime)}</div>
          <p>Read Time</p>
        </div>
        <div
          className="contributions-container"
          onClick={() =>
            setNotification({
              text: getNotificationMessage("user-total-time-of-posts"),
            })
          }
        >
          <div className="contributions">
            {getTimeFromSeconds(totalTimeOfAllPosts)}
          </div>
          <p>Contributions</p>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
