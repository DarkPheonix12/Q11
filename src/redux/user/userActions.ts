import firebase, { storageRef } from "../../firebase";
import { Dispatch } from "redux";
import { RootState, setNotification, UserActivityState } from "..";
import { firebaseAuth, firestoreRef } from "../../firebase";
import { setRequestActive, setLoading } from "../appState/appStateActions";
import {
  ChangeLoggedIn,
  LOGGED_IN,
  PopulateUserData,
  IncrementFollowingCount,
  DecrementFollowingCount,
  UserState,
  UserLogout,
  AddRecentActivity,
  UpdateProfileAvatar,
  UpdateUserSettings,
  SetUserSettings,
  SettingType,
} from "./userTypes";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import {
  FollowingSchema,
  RecentActivitySchema,
  UserActivitySchema,
  UserSchema,
} from "../../schemas";
import {
  populateUserActivity,
  updateFollowing,
} from "../userActivity/userActivityActions";
import {
  updateLocalUserActivity,
  updateLocalUserSettings,
} from "../../helperFunctions/localStorageActions";
import {
  addUserToFollowing,
  changeFollowedByCurrentUser,
  decrementFollowingUserProfiles,
  incrementFollowingUserProfiles,
} from "../userProfiles/userProfilesActions";
import { getFirebaseUserId } from "../../helperFunctions/firebaseUserActions";
import { UserSchemaRes } from "../../responseSchemas";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";

export const changeLoggedIn = (payload: boolean): ChangeLoggedIn => ({
  type: LOGGED_IN,
  payload,
});

export const populateUserData = (payload: UserState): PopulateUserData => ({
  type: "POPULATE_USER_DATA",
  payload,
});

export const userLogout = (): UserLogout => ({
  type: "USER_LOGOUT",
});

export const incrementFollowingCount = (): IncrementFollowingCount => ({
  type: "INCREMENT_FOLLOWING_COUNT",
});

export const decrementFollowingCount = (): DecrementFollowingCount => ({
  type: "DECREMENT_FOLLOWING_COUNT",
});

export const addRecentActivity = (
  recentActivity: RecentActivitySchema[]
): AddRecentActivity => ({
  type: "ADD_RECENT_ACTIVITY",
  payload: recentActivity,
});

export const updateProfileAvatar = (
  profileAvatar: string
): UpdateProfileAvatar => ({
  type: "UPDATE_PROFILE_AVATAR",
  payload: profileAvatar,
});

export const setUserSettings = (update: {
  settingType: SettingType;
  updateTo: boolean;
}): SetUserSettings => ({
  type: "SET_USER_SETTINGS",
  payload: update,
});

export const registerUser =
  (name: string, username: string, email: string, password: string) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch(setRequestActive(true));
    if (!name) {
      dispatch(
        setNotification({ text: getNotificationMessage("full-name-required") })
      );
      dispatch(setRequestActive(false));
      return false;
    } else if (!username) {
      dispatch(
        setNotification({ text: getNotificationMessage("username-required") })
      );
      dispatch(setRequestActive(false));
      return false;
    }
    try {
      const checkUser = await firestoreRef
        .collection("users")
        .where("username", "==", username)
        .get();
      if (!checkUser.empty) {
        dispatch(
          setNotification({ text: getNotificationMessage("username-exists") })
        );
        dispatch(setRequestActive(false));
        return false;
      }

      await firebaseAuth.createUserWithEmailAndPassword(email, password);

      const user = firebaseAuth.currentUser;
      const currentDate = firebase.firestore.FieldValue.serverTimestamp();

      const newUser: UserSchema = {
        name,
        username,
        email,
        profileAvatar: "",
        userSettings: {
          allowNotifications: true,
          replyNotifications: true,
          profileVisibility: "public", // "public" === false
          quriosity: false, // desc: answers won't appear on search
          publishedCreationsVisibility: false, // desc: books won't appear on search
        },
        following: 0,
        followers: 0,
        minutesRead: 0,
        numberOfImpacts: 0,
        numberOfPublishedPosts: 0,
        profileViews: 0,
        totalTimeOfAllPosts: 0,
        recentActivity: [],
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      const newUserActivity: UserActivitySchema = {
        bookmarks: [],
        following: [],
        ratedPosts: [],
        questionLikes: [],
        answerLikes: [],
        postQuestionAnswerLikes: [],
      };

      if (user) {
        await firestoreRef.collection("users").doc(user.uid).set(newUser);
        await firestoreRef
          .collection("userActivity")
          .doc(user.uid)
          .set(newUserActivity);
        dispatch(
          populateUserData({
            ...newUser,
            loggedIn: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
        );
        dispatch(populateUserActivity(newUserActivity));
        localStorage.setItem("userInfo", JSON.stringify(newUser));
        localStorage.setItem("userActivity", JSON.stringify(newUserActivity));
        dispatch(changeLoggedIn(true));
        dispatch(setRequestActive(false));

        return true;
      }
      return false;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(setRequestActive(false));
      console.error(err);
      return false;
    }
  };

export const logIn =
  (email: string, password: string) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch(setRequestActive(true));
    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
      const currentUser = firebaseAuth.currentUser;

      const user =
        currentUser &&
        (await firestoreRef.doc(`users/${currentUser.uid}`).get());
      const userInfo = user && (user.data() as UserSchemaRes);

      const userActivity =
        currentUser &&
        (await firestoreRef.doc(`userActivity/${currentUser.uid}`).get());
      const userActivityInfo =
        userActivity && (userActivity.data() as UserActivityState);

      if (userInfo && userActivityInfo) {
        userInfo.email = email;
        dispatch(populateUserData({ ...userInfo, loggedIn: true }));
        dispatch(populateUserActivity(userActivityInfo));
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("userActivity", JSON.stringify(userActivityInfo));
      }
      dispatch(changeLoggedIn(true));
      dispatch(setRequestActive(false));
      return true;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(setRequestActive(false));
      console.error(err);
      return false;
    }
  };

export const logOut = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    await firebaseAuth.signOut();
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userActivity");
    localStorage.removeItem("tempPosts");
    localStorage.removeItem("unpublishedPosts");
    dispatch(userLogout());
    dispatch(setLoading(false));
    return true;
  } catch (err) {
    dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
    dispatch(setLoading(false));
    console.error(err);
    return false;
  }
};

export const followUser =
  (followedUserId: string) =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    if (firebaseAuth.currentUser) {
      const userId = firebaseAuth.currentUser.uid;
      // Update state first - reset in catch block
      dispatch(incrementFollowingCount());
      dispatch(incrementFollowingUserProfiles(followedUserId));
      dispatch(changeFollowedByCurrentUser(followedUserId));
      dispatch(updateFollowing(followedUserId));
      try {
        // Check if follow exists
        const qs = await firestoreRef
          .collection("following")
          .where("followerUserId", "==", userId)
          .where("followedUserId", "==", followedUserId)
          .get();

        // If empty continue
        if (qs.empty) {
          // Adding the follow
          const newFollow: FollowingSchema = {
            followerUserId: userId,
            followedUserId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          };
          await firestoreRef.collection("following").add(newFollow);
        } else {
          // if not empty throw error
          dispatch(
            setNotification({
              text: getNotificationMessage("user-already-followed"),
            })
          );
          throw new Error(getNotificationMessage("user-already-followed"));
        }
        // Adding the followedUserId to the followers array in userActivity
        await firestoreRef.doc(`userActivity/${userId}`).update({
          following: firebase.firestore.FieldValue.arrayUnion(followedUserId),
        });

        await firestoreRef.doc(`users/${userId}`).update({
          following: firebase.firestore.FieldValue.increment(1),
        });

        const localUserActivity = localStorage.getItem("userActivity");
        const localUserActivityParsed =
          localUserActivity && JSON.parse(localUserActivity);

        dispatch(
          setNotification({ text: getNotificationMessage("follow-success") })
        );

        // find user if available in state and push to "following"
        const profilesUser = getState().userProfiles.profiles.filter(
          (profile) => profile.userId === followedUserId
        )[0];
        const followersUser = getState().userProfiles.followers.filter(
          (profile) => profile.userId === followedUserId
        )[0];
        if (profilesUser || followersUser)
          dispatch(addUserToFollowing(profilesUser || followersUser));

        updateLocalUserActivity({
          // CHECK HOW YOU'RE UPDATING STATE FOR USER BEING FOLLLOWERD
          following: [...localUserActivityParsed.following, followedUserId],
        });
        return true;
      } catch (err) {
        dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
        // reset state to previous values
        dispatch(decrementFollowingCount());
        dispatch(decrementFollowingUserProfiles(followedUserId));
        dispatch(changeFollowedByCurrentUser(followedUserId));
        dispatch(updateFollowing(followedUserId));
        console.error(err);
        return false;
      }
    } else {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      return false;
    }
  };

export const unfollowUser =
  (followedUserId: string) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    if (firebaseAuth.currentUser) {
      const userId = firebaseAuth.currentUser.uid;
      // Update state first - reset in catch block
      dispatch(decrementFollowingUserProfiles(followedUserId));
      dispatch(decrementFollowingCount());
      dispatch(changeFollowedByCurrentUser(followedUserId));
      dispatch(updateFollowing(followedUserId));
      try {
        // Removing the follow
        const qs = await firestoreRef
          .collection("following")
          .where("followerUserId", "==", userId)
          .where("followedUserId", "==", followedUserId)
          .get();

        if (!qs.empty) {
          const docToRemove = qs.docs[0];
          await firestoreRef.doc(`following/${docToRemove.id}`).delete();
        }
        // Update following count for current user
        await firestoreRef.doc(`users/${userId}`).update({
          following: firebase.firestore.FieldValue.increment(-1),
        });

        // Remove the followedUserId from the followers array in userActivity
        await firestoreRef.doc(`userActivity/${userId}`).update({
          following: firebase.firestore.FieldValue.arrayRemove(followedUserId),
        });

        const localUserActivity = localStorage.getItem("userActivity");
        const localUserActivityParsed =
          localUserActivity && JSON.parse(localUserActivity);

        updateLocalUserActivity({
          following: localUserActivityParsed.following.filter(
            (follow: string) => follow !== followedUserId
          ),
        });

        dispatch(
          setNotification({
            text: getNotificationMessage("unfollow-success"),
          })
        );
        return true;
      } catch (err) {
        dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
        // reset state to previous values if error
        dispatch(incrementFollowingUserProfiles(followedUserId));
        dispatch(incrementFollowingCount());
        dispatch(changeFollowedByCurrentUser(followedUserId));
        dispatch(updateFollowing(followedUserId));
        console.error(err);
        return false;
      }
    } else {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      return false;
    }
  };

export const uploadProfileAvatar =
  (profileAvatar: string) =>
  (dispatch: Dispatch): void => {
    if (firebaseAuth.currentUser) {
      dispatch(setRequestActive(true));
      const userId = firebaseAuth.currentUser.uid;
      const uploadTask = storageRef
        .child(`userAvatars/${userId}`)
        .putString(profileAvatar, "data_url");

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          dispatch(setNotification({ text: `Upload is ${progress}% done` }));
        },
        (err) => {
          dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
          console.error(err);
          return;
        },
        () => {
          // Get the download URL on upload success
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            try {
              await firestoreRef
                .doc(`users/${userId}`)
                .update({ profileAvatar: downloadURL });
              dispatch(setRequestActive(false));
            } catch (err) {
              dispatch(
                setNotification({ text: customFirebaseErrorMessage(err) })
              );
              dispatch(setRequestActive(false));
              console.error(err);
              return;
            }
            dispatch(updateProfileAvatar(downloadURL));
            dispatch(
              setNotification({
                text: getNotificationMessage("img-upload-success"),
              })
            );
          });
        }
      );
    } else {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
    }
  };

export const updateUserSetting =
  (update: UpdateUserSettings) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    const userId = getFirebaseUserId();
    if (userId) {
      const { settingType, updateTo } = update;
      dispatch(setUserSettings({ settingType, updateTo })); // update state first - reset in catch block
      try {
        const userDocRef = firestoreRef.doc(`users/${userId}`);
        const updatePath = `userSettings.${settingType}`;

        if (update.settingType === "profileVisibility") {
          await userDocRef.update({
            [updatePath]: updateTo ? "private" : "public",
          });
          updateLocalUserSettings({
            [settingType]: updateTo ? "private" : "public",
          });
        } else {
          await userDocRef.update({
            [updatePath]: updateTo,
          });

          updateLocalUserSettings({ [settingType]: updateTo });
        }
        switch (update.settingType) {
          case "allowNotifications":
            dispatch(
              setNotification({
                text: `Notifications have been turned ${
                  updateTo ? "on" : "off"
                }`,
              })
            );
            break;
          case "replyNotifications":
            dispatch(
              setNotification({
                text: `Reply notifications have been turned ${
                  updateTo ? "on" : "off"
                }`,
              })
            );
            break;
          default:
            break;
        }
        return true;
      } catch (err) {
        dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
        dispatch(setUserSettings({ settingType, updateTo: !updateTo })); // reset state if error
        console.error(err);
        return false;
      }
    } else {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      return false;
    }
  };

// export const testPopulateUsers = async () => {
//   const username = "nvacic";
//   const email = "@gmail.com";
//   const name = "Nikola Vacic";
//   let createdUser: firebase.auth.UserCredential;

//   for (let i = 0; i < 20; i++) {
//     const newEmail = `${username}${i + 1}${email}`;
//     createdUser = await firebaseAuth.createUserWithEmailAndPassword(
//       newEmail,
//       "123456"
//     );

//     const currentDate = firebase.firestore.FieldValue.serverTimestamp();

//     const newUser: UserSchema = {
//       name: `${name}${i + 1}`,
//       username: `${username}${i + 1}`,
//       email: newEmail,
//       profileAvatar: "",
//       userSettings: {
//         allowNotifications: true,
//         replyNotifications: true,
//         profileVisibility: "public", // "public" === false
//         quriosity: false, // desc: answers won't appear on search
//         publishedCreationsVisibility: false, // desc: books won't appear on search
//       },
//       following: 0,
//       followers: 0,
//       minutesRead: 0,
//       numberOfImpacts: 0,
//       numberOfPublishedPosts: 0,
//       profileViews: 0,
//       totalTimeOfAllPosts: 0,
//       recentActivity: [],
//       createdAt: currentDate,
//       updatedAt: currentDate,
//     };

//     const newUserActivity: UserActivitySchema = {
//       bookmarks: [],
//       following: [],
//       ratedPosts: [],
//       questionLikes: [],
//       answerLikes: [],
//       postQuestionAnswerLikes: [],
//     };

//     if (createdUser) {
//       console.log(createdUser.user?.uid);
//       await firestoreRef
//         .collection("users")
//         .doc(createdUser.user?.uid)
//         .set(newUser);
//       await firestoreRef
//         .collection("userActivity")
//         .doc(createdUser.user?.uid)
//         .set(newUserActivity);
//     }
//   }
// };

// export const testPopulateFollowers = async () => {
//   if (firebaseAuth.currentUser) {
//     const qs = await firestoreRef
//       .collection("users")
//       .orderBy("createdAt", "desc")
//       .get();

//     for (const profileDocRef of qs.docs) {
//       if (profileDocRef.id !== firebaseAuth.currentUser.uid) {
//         // Adding the follow
//         const newFollow: FollowingSchema = {
//           followerUserId: profileDocRef.id,
//           followedUserId: firebaseAuth.currentUser.uid,
//           createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//         };
//         try {
//           const addedFollow = await firestoreRef
//             .collection("following")
//             .add(newFollow);
//           await firestoreRef
//             .doc(`users/${firebaseAuth.currentUser.uid}`)
//             .update({ followers: firebase.firestore.FieldValue.increment(1) });
//           console.log(addedFollow.id);
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     }
//   }
// };
