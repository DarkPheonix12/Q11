import React, { useEffect, useRef, useState } from "react";
import {
  followUser,
  getUserProfileByUsername,
  loadingProfile,
  RootState,
  setNotification,
  Notification,
  updateProfileAvatar,
  uploadProfileAvatar,
  UserProfile,
  UserState,
} from "../../../redux";
import ProfileHeader from "./profileViews/ProfileHeader";
import { connect } from "react-redux";
import ProfileCreations from "./profileViews/ProfileCreations";
import ProfileLibrary from "./profileViews/ProfileLibrary";
import RecentActivityCard from "./profileViews/RecentActivityCard";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getFormattedDateString } from "../../../helperFunctions";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import Spinner from "../../helperComponents/Spinner";
import { RecentActivitySchema } from "../../../schemas";
import { data } from "../randomData";
import { getNotificationMessage } from "../../../helperFunctions/customNotificationMessages";
import { shareLink } from "../../../helperFunctions/userActions";

interface ProfileProps {
  currentUser: UserState;
  userProfiles: UserProfile[];
  userFollowing: string[];
  loading: boolean;
  getUserProfileByUsername: (username: string) => Promise<boolean>;
  updateProfileAvatar: (profileAvatar: string) => void;
  uploadProfileAvatar: (profileAvatar: string) => void;
  loadingProfile: (loading: boolean) => void;
  setNotification: typeof setNotification;
  followUser: (followedUserId: string) => Promise<boolean>;
}

interface UserToShow {
  numberOfPublishedPosts: number;
  followers: number;
  name: string;
  username: string;
  profileAvatar: string;
  minutesRead: number;
  totalTimeOfAllPosts: number;
  createdAt: { seconds: number; nanoseconds: number };
  recentActivity: RecentActivitySchema[];
}

const Profile: React.FC<ProfileProps> = ({
  currentUser,
  userProfiles,
  userFollowing,
  loading,
  updateProfileAvatar,
  uploadProfileAvatar,
  getUserProfileByUsername,
  loadingProfile,
  followUser,
  setNotification,
}) => {
  const [userToShow, setUserToShow] = useState<
    UserProfile | UserState | UserToShow
  >({
    numberOfPublishedPosts: 0,
    followers: 0,
    name: "",
    profileAvatar: "",
    username: "",
    minutesRead: 0,
    totalTimeOfAllPosts: 0,
    createdAt: { seconds: 0, nanoseconds: 0 },
    recentActivity: [],
  });
  const [selectedFileDataUrl, setSelectedFile] = useState<string | null>(null);
  const [showFollowButton, changeShowFollowButton] = useState(false);
  const [requestActive, changeRequestActive] = useState(false);

  const username = useParams<{ username: string }>().username;
  const location = useLocation();
  const currentUserProfile = !!location.pathname.match("/home/profile"); // used to determine whether to pull data from user state or userProfile state/firstore
  const fileForm = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const history = useHistory();

  const onFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    selectedFileDataUrl && uploadProfileAvatar(selectedFileDataUrl);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const allowedFileTypes = ["image/x-png", "image/jpeg", "image/png"];
      const file = e.target.files[0];
      if (allowedFileTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const imgElement = document.createElement("img");
          if (e.target) {
            imgElement.src = e.target.result as string;
          }

          imgElement.onload = (e) => {
            if (e.target) {
              const img = e.target as HTMLImageElement;
              const canvas = document.createElement("canvas");
              const maxWidth = 400;

              const scaleSize = maxWidth / img.width;
              canvas.width = maxWidth;
              canvas.height = img.height * scaleSize;

              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const srcEncoded = ctx.canvas.toDataURL(img.src, "image/jpeg");
                updateProfileAvatar(srcEncoded);
                setSelectedFile(srcEncoded);
              }
            }
          };
        };
      } else
        setNotification({
          text: getNotificationMessage("unsupported-file-format"),
        });
    } else
      setNotification({ text: getNotificationMessage("no-file-selected") });
  };

  const addImgClick = () => fileInput.current && fileInput.current.click();

  const handleFollow = async () => {
    if (!requestActive) {
      changeRequestActive(true);
      "userId" in userToShow && (await followUser(userToShow.userId));
      changeRequestActive(false);
    }
  };

  const handleShare = () => {
    if (currentUserProfile) {
      const urlObject = window.location;
      const userUrl = `${urlObject.protocol}//${urlObject.host}/home/user/${userToShow.username}`;
      shareLink({ customUrl: userUrl });
    } else shareLink();
  };
  // populate state with user profile
  useEffect(() => {
    const getProfile = async () => {
      if (currentUserProfile) {
        setUserToShow(currentUser);
        loadingProfile(false); // Need to set loading to false because getUserProfileByUsername doesn't run
      } else {
        const profileFound = await getUserProfileByUsername(username);
        if (!profileFound) setTimeout(() => history.push("/home"), 2000);
      }
    };

    getProfile();
  }, [
    currentUser,
    currentUserProfile,
    getUserProfileByUsername,
    history,
    loadingProfile,
    username,
  ]);

  // Gets the user profile from state
  useEffect(() => {
    const profile = userProfiles.filter(
      (profile) => profile.username === username
    )[0];
    if (profile !== undefined) setUserToShow(profile);
  }, [userProfiles, username]);

  // Submits request if selectedFileDataUrl is not null and when it changes
  useEffect(() => {
    if (fileForm.current)
      selectedFileDataUrl && fileForm.current.requestSubmit();
  }, [selectedFileDataUrl]);

  // Checks if follow button should be shown
  useEffect(() => {
    if (
      "userId" in userToShow &&
      !userFollowing.includes(userToShow.userId) &&
      currentUser.username !== userToShow.username
    )
      changeShowFollowButton(true);
    else changeShowFollowButton(false);
  }, [userFollowing, userToShow, currentUser.username]);
  return (
    <section className={`${!userToShow.name ? "empty" : ""} profile`}>
      {loading ? (
        <Spinner />
      ) : userToShow.name ? (
        <>
          <form onSubmit={(e) => onFileUpload(e)} ref={fileForm}>
            <input
              type="file"
              accept="image/x-png,image/jpeg"
              ref={fileInput}
              onChange={(e) => onFileChange(e)}
            />
          </form>
          <ProfileHeader
            numberOfPublishedPosts={userToShow.numberOfPublishedPosts}
            followersCount={userToShow.followers}
            fullName={userToShow.name}
            profileAvatar={userToShow.profileAvatar}
            readTime={userToShow.minutesRead}
            totalTimeOfAllPosts={userToShow.totalTimeOfAllPosts}
            joined={getFormattedDateString(userToShow.createdAt, "profileDate")}
            lastActive={
              userToShow.recentActivity.length > 0
                ? getFormattedDateString(
                    userToShow.recentActivity[0].createdAt,
                    "recentActivity"
                  )
                : null
            }
            addImgClick={addImgClick}
            showFollowButton={showFollowButton}
            handleFollow={handleFollow}
            handleShare={handleShare}
            setNotification={setNotification}
          />
          <div className="profile-content">
            <section className="recent-activity">
              {userToShow.recentActivity.length > 0 && (
                <>
                  <div className="section-header">
                    <p className="section-label">Recent Activity</p>
                  </div>
                  {userToShow.recentActivity.map((activity, i) => (
                    <RecentActivityCard
                      activity={activity}
                      key={i}
                      profileAvatar={userToShow.profileAvatar}
                    />
                  ))}
                </>
              )}
            </section>
            <ProfileCreations libData={data.cards} />
            <ProfileLibrary libData={data.cards} />
          </div>
          {currentUserProfile && (
            <button className="btn btn-secondary">Invite Friends</button>
          )}
        </>
      ) : (
        <h1 className="not-found">User not found. Redirecting...</h1>
      )}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentUser: state.user,
  userProfiles: state.userProfiles.profiles,
  loading: state.userProfiles.loading,
  userFollowing: state.userActivity.following,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  updateProfileAvatar: (profileAvatar: string) =>
    dispatch(updateProfileAvatar(profileAvatar)),
  uploadProfileAvatar: (profileAvatar: string) =>
    dispatch(uploadProfileAvatar(profileAvatar)),
  getUserProfileByUsername: (username: string) =>
    dispatch(getUserProfileByUsername(username)),
  loadingProfile: (loading: boolean) => dispatch(loadingProfile(loading)),
  setNotification: (notification: Notification) =>
    dispatch(setNotification(notification)),
  followUser: (followedUserId: string) => dispatch(followUser(followedUserId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
