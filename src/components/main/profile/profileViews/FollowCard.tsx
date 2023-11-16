import React from "react";
import { useHistory } from "react-router-dom";
import { debounce } from "../../../../helperFunctions";
import { UserProfile } from "../../../../redux";
import { FollowedIcon, FollowIcon } from "../../../helperComponents/svgIcons";
import UserImageRounded from "../../../helperComponents/UserImageRounded";

interface FollowCardProps {
  userData: UserProfile;
  lastFollowDivRef?: (node: any) => void;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
}

const FollowCard: React.FC<FollowCardProps> = ({
  userData,
  lastFollowDivRef,
  followUser,
  unfollowUser,
}) => {
  const history = useHistory();
  const {
    username,
    profileAvatar,
    name,
    followers,
    following,
    isFollowedByCurrentUser,
    userId,
  } = userData;

  return (
    <div className="follow-card" ref={lastFollowDivRef || null}>
      <div
        className="user-img"
        onClick={() => history.push(`/home/user/${username}`)}
      >
        <UserImageRounded src={profileAvatar} alt={name} />
      </div>
      <div className="user-info">
        <div className="name-username">
          <div className="name">{name}</div>{" "}
          <div className="username">@{username}</div>
        </div>
        <div className="follow-info">
          {followers} Followers {following} Following
        </div>
      </div>
      <div
        className="follow-button"
        onClick={
          isFollowedByCurrentUser
            ? debounce(() => unfollowUser(userId))
            : debounce(() => followUser(userId))
        }
      >
        {isFollowedByCurrentUser ? <FollowedIcon /> : <FollowIcon />}
      </div>
    </div>
  );
};

export default FollowCard;
