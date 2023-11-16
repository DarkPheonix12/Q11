import { connect } from "react-redux";
import React, { useEffect } from "react";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  RootState,
  followUser,
  unfollowUser,
  getUserFollowing,
  UserProfile,
} from "../../../../redux";
import FollowCard from "./FollowCard";
import Spinner from "../../../helperComponents/Spinner";
import { useObserveIntersection } from "../../../../helperFunctions/customHooks";

interface UserFollowingProps {
  following: UserProfile[];
  loading: boolean;
  getUserFollowing: () => Promise<boolean>;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
}

const UserFollowing: React.FC<UserFollowingProps> = ({
  following,
  loading,
  getUserFollowing,
  followUser,
  unfollowUser,
}) => {
  const [lastFollowDivRef] = useObserveIntersection(getUserFollowing);

  useEffect(() => {
    following.length < 1 && getUserFollowing();
  }, [getUserFollowing, following.length]);

  return (
    <div className="profile-followers-content">
      {following.length > 0 &&
        following.map((followedUser, i) => {
          return following.length === i + 1 ? (
            <FollowCard
              userData={followedUser}
              followUser={followUser}
              unfollowUser={unfollowUser}
              key={i}
              lastFollowDivRef={lastFollowDivRef}
            />
          ) : (
            <FollowCard
              userData={followedUser}
              followUser={followUser}
              unfollowUser={unfollowUser}
              key={i}
            />
          );
        })}
      {loading && <Spinner />}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  following: state.userProfiles.following,
  loading: state.userProfiles.loading,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getUserFollowing: () => dispatch(getUserFollowing()),
  followUser: (userId: string) => dispatch(followUser(userId)),
  unfollowUser: (followedUserId: string) =>
    dispatch(unfollowUser(followedUserId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserFollowing);
