import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useObserveIntersection } from "../../../../helperFunctions/customHooks";
import {
  followUser,
  getUserFollowers,
  RootState,
  unfollowUser,
  UserProfile,
} from "../../../../redux";
import Spinner from "../../../helperComponents/Spinner";
import FollowCard from "./FollowCard";

interface UserFollowersProps {
  followers: UserProfile[];
  loading: boolean;
  getUserFollowers: () => Promise<boolean>;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
}

const UserFollowers: React.FC<UserFollowersProps> = ({
  getUserFollowers,
  followUser,
  unfollowUser,
  loading,
  followers,
}) => {
  const [lastFollowDivRef] = useObserveIntersection(getUserFollowers);

  useEffect(() => {
    followers.length < 1 && getUserFollowers();
  }, [followers.length, getUserFollowers]);

  return (
    <div className="profile-followers-content">
      {followers.length > 0 &&
        followers.map((follower, i) => {
          return followers.length === i + 1 ? (
            <FollowCard
              userData={follower}
              followUser={followUser}
              unfollowUser={unfollowUser}
              key={i}
              lastFollowDivRef={lastFollowDivRef}
            />
          ) : (
            <FollowCard
              userData={follower}
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
  followers: state.userProfiles.followers,
  loading: state.userProfiles.loading,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getUserFollowers: () => dispatch(getUserFollowers()),
  followUser: (followedUserId: string) => dispatch(followUser(followedUserId)),
  unfollowUser: (followedUserId: string) =>
    dispatch(unfollowUser(followedUserId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserFollowers);
