import { DocumentData } from "@google-cloud/firestore";
import { Dispatch } from "redux";
import { firebaseAuth, firestoreRef } from "../../firebase";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import {
  checkIfFollowing,
  getLocalFollowing,
} from "../../helperFunctions/localStorageActions";
import { UserSchemaRes } from "../../responseSchemas";
import { FollowingSchema } from "../../schemas";
import { setNotification } from "../notifications/notificationActions";
import { RootState } from "../rootReducer";
import {
  AddUserAvatarById,
  AddUserProfile,
  AddUserToFollowing,
  AvatarByUserId,
  ChangeFollowedByCurrentUser,
  ChangeHasMoreFollowers,
  ChangeHasMoreFollowing,
  DecrementFollowersUserProfiles,
  IncrementFollowersUserProfiles,
  LoadingProfile,
  PopulateFollowers,
  PopulateFollowing,
  SetLastFollowerDocRef,
  SetLastFollowingArrayRef,
  UserProfile,
} from "./userProfilesTypes";

export const addUserProfile = (userProfile: UserProfile): AddUserProfile => ({
  type: "ADD_USER_PROFILE",
  payload: userProfile,
});

export const addUserAvatarById = (
  avatarByUserId: AvatarByUserId
): AddUserAvatarById => ({
  type: "ADD_USER_AVATAR_BY_ID",
  payload: avatarByUserId,
});

export const loadingProfile = (loading: boolean): LoadingProfile => ({
  type: "LOADING_PROFILE",
  payload: loading,
});

export const incrementFollowingUserProfiles = (
  userId: string
): IncrementFollowersUserProfiles => ({
  type: "INCREMENT_FOLLOWERS__USER_PROFILES",
  payload: userId,
});

export const decrementFollowingUserProfiles = (
  userId: string
): DecrementFollowersUserProfiles => ({
  type: "DECREMENT_FOLLOWERS__USER_PROFILES",
  payload: userId,
});

export const changeFollowedByCurrentUser = (
  userId: string
): ChangeFollowedByCurrentUser => ({
  type: "CHANGE_FOLLOWED_BY_CURRENT_USER",
  payload: userId,
});

export const changeHasMoreFollowers = (
  hasMore: boolean
): ChangeHasMoreFollowers => ({
  type: "CHANGE_HAS_MORE_FOLLOWERS",
  payload: hasMore,
});

export const changeHasMoreFollowing = (
  hasMore: boolean
): ChangeHasMoreFollowing => ({
  type: "CHANGE_HAS_MORE_FOLLOWING",
  payload: hasMore,
});

export const setLastFollowerDocRef = (
  lastFollowerDocRef: DocumentData
): SetLastFollowerDocRef => ({
  type: "SET_LAST_FOLLOWER_DOC_REF",
  payload: lastFollowerDocRef,
});

export const setLastFollowingArrayRef = (
  lastFollowingId: string
): SetLastFollowingArrayRef => ({
  type: "SET_LAST_FOLLOWING_ARRAY_REF",
  payload: lastFollowingId,
});

export const populateFollowing = (
  followedUsers: UserProfile[]
): PopulateFollowing => ({
  type: "POPULATE_FOLLOWING",
  payload: followedUsers,
});

export const addUserToFollowing = (
  userInfo: UserProfile
): AddUserToFollowing => ({
  type: "ADD_USER_TO_FOLLOWING",
  payload: userInfo,
});

export const populateFollowers = (
  followers: UserProfile[]
): PopulateFollowers => ({
  type: "POPULATE_FOLLOWERS",
  payload: followers,
});

export const getUserProfileByUsername =
  (username: string) =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    dispatch(loadingProfile(true));

    // Check if profile is in state
    const userProfiles = getState().userProfiles.profiles;
    const followedUsers = getState().userProfiles.following;
    const followers = getState().userProfiles.followers;

    let profile = userProfiles.filter(
      (profile) => profile.username === username
    )[0];
    // If profile found in state return true
    if (profile !== undefined) {
      dispatch(loadingProfile(false));
      return true;
    }

    if (profile === undefined) {
      profile = followedUsers.filter(
        (profile) => profile.username === username
      )[0];
      if (profile !== undefined) {
        dispatch(addUserProfile(profile));
        dispatch(loadingProfile(false));
        return true;
      } else {
        profile = followers.filter(
          (profile) => profile.username === username
        )[0];

        if (profile !== undefined) {
          dispatch(addUserProfile(profile));
          dispatch(loadingProfile(false));
          return true;
        }
      }
    }

    // If profile is not in state get it from firestore
    try {
      const qs = await firestoreRef
        .collection("users")
        .where("username", "==", username)
        .get();
      if (!qs.empty) {
        const userProfileData = qs.docs[0].data() as UserSchemaRes; // This will be missing the userId Field
        const userId = qs.docs[0].id;
        const userProfile: UserProfile = {
          ...userProfileData,
          userId,
          isFollowedByCurrentUser: checkIfFollowing(userId),
        };
        dispatch(addUserProfile(userProfile));
        dispatch(
          addUserAvatarById({
            userId,
            avatarUrl: userProfile.profileAvatar,
          })
        );
        dispatch(loadingProfile(false));
        return true;
      } else {
        dispatch(loadingProfile(false));
        return false;
      }
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(loadingProfile(false));
      console.error(err);
      return false;
    }
  };

export const getUserFollowers =
  () =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    // if no more followers
    if (!getState().userProfiles.hasMoreFollowers) return false;

    dispatch(loadingProfile(true));
    const user = firebaseAuth.currentUser;
    const followingRef = firestoreRef.collection("following");
    const lastDoc = getState().userProfiles.lastFollowerDocRef;
    const followerPromises = [];
    const followersArray: UserProfile[] = [];
    let limit = 10;
    let numOfDoc = 0;
    if (user) {
      const userId = user.uid;
      try {
        const qs = lastDoc
          ? await followingRef
              .orderBy("createdAt", "desc")
              .where("followedUserId", "==", userId)
              .startAfter(lastDoc)
              .limit(limit)
              .get()
          : await followingRef
              .orderBy("createdAt", "desc")
              .where("followedUserId", "==", userId)
              .limit(limit)
              .get();

        if (!qs.empty) {
          for (const doc of qs.docs) {
            // follower promises in Promise.all, create all the neccessary redux actions, create the other function
            numOfDoc++;
            if (numOfDoc === qs.docs.length)
              dispatch(setLastFollowerDocRef(doc));
            const followingData = doc.data() as FollowingSchema;
            const followerId = followingData.followerUserId;
            const followerPromise = firestoreRef
              .doc(`users/${followerId}`)
              .get();
            followerPromises.push(followerPromise);
          }

          try {
            const followerProfileDocs = await Promise.all(followerPromises);
            for (const followerProfileRef of followerProfileDocs) {
              if (followerProfileRef.exists) {
                const followerProfile =
                  followerProfileRef.data() as UserSchemaRes;
                followersArray.push({
                  ...followerProfile,
                  userId: followerProfileRef.id,
                  isFollowedByCurrentUser: checkIfFollowing(
                    followerProfileRef.id
                  ),
                });
              }
            }
          } catch (err) {
            console.error(customFirebaseErrorMessage(err));
            dispatch(loadingProfile(false));
            console.error(err);
            return false;
          }
        } else {
          // If empty hasMore = false and send back a notification
          dispatch(
            setNotification({
              text: getNotificationMessage("no-more-followers"),
            })
          );
          dispatch(changeHasMoreFollowers(false));
          dispatch(loadingProfile(false));
          return true;
        }
        if (followersArray.length > 0) {
          dispatch(populateFollowers(followersArray));
          followersArray.forEach((follower) => {
            dispatch(
              addUserAvatarById({
                userId: follower.userId,
                avatarUrl: follower.profileAvatar,
              })
            );
          });
        }
        if (followersArray.length < limit) {
          dispatch(
            setNotification({
              text: getNotificationMessage("no-more-followers"),
            })
          );
          dispatch(changeHasMoreFollowers(false));
        }

        dispatch(loadingProfile(false));
        return true;
      } catch (err) {
        dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
        dispatch(loadingProfile(false));
        console.error(err);
        return false;
      }
    } else {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      dispatch(loadingProfile(false));
      return false;
    }
  };

export const getUserFollowing =
  () =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    // if no more following
    if (!getState().userProfiles.hasMoreFollowing) return false;

    dispatch(loadingProfile(true));
    const followedUserPromises = [];
    const followedUserProfiles: UserProfile[] = [];
    const followedUserIds = getLocalFollowing();

    if (!followedUserIds) {
      dispatch(setNotification({ text: getNotificationMessage("no-follows") }));
      dispatch(changeHasMoreFollowing(false));
      dispatch(loadingProfile(false));
      return false;
    }

    const lastFollowingArrayRef = getState().userProfiles.lastFollowingArrayRef;
    const lastArrayPosition = followedUserIds.indexOf(lastFollowingArrayRef);
    const limit = 10;
    const forLoopLimit =
      lastArrayPosition === -1
        ? followedUserIds.length - limit < 0
          ? 0
          : followedUserIds.length - limit
        : lastArrayPosition - limit < 0
        ? 0
        : lastArrayPosition - limit;
    let numOfDoc = 0;

    try {
      for (
        let i =
          lastArrayPosition !== -1
            ? lastArrayPosition - 1
            : followedUserIds.length - 1;
        i >= forLoopLimit;
        i--
      ) {
        numOfDoc++;
        if (numOfDoc === limit)
          dispatch(setLastFollowingArrayRef(followedUserIds[i]));
        const qs = firestoreRef.doc(`users/${followedUserIds[i]}`).get();
        followedUserPromises.push(qs);
      }
      const data = await Promise.all(followedUserPromises);
      for (const followedUserDoc of data) {
        if (followedUserDoc.exists) {
          const followedUserData = followedUserDoc.data() as UserSchemaRes;
          followedUserProfiles.push({
            ...followedUserData,
            userId: followedUserDoc.id,
            isFollowedByCurrentUser: true,
          });
        }
      }
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(loadingProfile(false));
      console.error(err);
      return false;
    }

    if (followedUserProfiles.length > 0)
      dispatch(populateFollowing(followedUserProfiles));
    if (followedUserProfiles.length < limit) {
      dispatch(
        setNotification({
          text: getNotificationMessage("no-more-followed-users"),
        })
      );
      dispatch(changeHasMoreFollowing(false));
    }
    dispatch(loadingProfile(false));
    return true;
  };
