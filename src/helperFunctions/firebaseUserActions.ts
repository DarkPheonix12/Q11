import firebase, { firebaseAuth, firestoreRef, storageRef } from "../firebase";
import {
  addUserAvatarById,
  changeLoggedIn,
  setRequestActive,
  populateUserActivity,
  populateUserData,
  setLoading,
  setNotification,
} from "../redux";
import store from "../redux/store";
import { UserSchemaRes } from "../responseSchemas";
import { getNotificationMessage } from "./customNotificationMessages";
import { customFirebaseErrorMessage } from "./firestoreErrorHandler";

export const addBetaUser = async (
  email: string,
  name = "",
  note = ""
): Promise<void> => {
  if (!email)
    store.dispatch(
      setNotification({ text: getNotificationMessage("email-empty") })
    );
  else if (
    !email.match(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    )
  ) {
    store.dispatch(
      setNotification({ text: getNotificationMessage("invalid-email") })
    );
  } else {
    try {
      const user = await firestoreRef
        .collection("beta_users")
        .where("email", "==", email)
        .get();
      if (user.empty) {
        firestoreRef.collection("beta_users").add({
          email,
          name,
          note,
        });
        store.dispatch(
          setNotification({
            text: getNotificationMessage("thank-you-beta"),
          })
        );
      } else {
        store.dispatch(
          setNotification({ text: getNotificationMessage("user-exists") })
        );
      }
    } catch (err) {
      store.dispatch(
        setNotification({ text: customFirebaseErrorMessage(err) })
      );
      console.error(err);
    }
  }
};

export const getUserInfo = async (userId: string) => {
  try {
    // ********** removed local storage functionality because "followers" count needs to be updated on refresh *********

    // const userFromLocalStorage = await localStorage.getItem("userInfo");
    const userInfo = // if there is no user in local storage - get the user doc from firestore
      // !userFromLocalStorage &&
      await firestoreRef.doc(`users/${userId}`).get();

    // const newUserInfo = userFromLocalStorage // user info from local storage if available
    //   ? await JSON.parse(userFromLocalStorage)
    //   : userInfo && userInfo.data();
    const newUserInfo = userInfo.data() as UserSchemaRes;
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));

    return newUserInfo;
  } catch (err) {
    store.dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
    console.error(err);
    return false;
  }
};

export const getUserActivityInfo = async (userId: string) => {
  try {
    const userActivityFromLocalStorage = await localStorage.getItem(
      "userActivity"
    );

    const userActivityInfo = // if there is no user in local storage - get the user doc from firestore
      !userActivityFromLocalStorage &&
      (await firestoreRef.doc(`userActivity/${userId}`).get());

    const newUserActivityInfo = userActivityFromLocalStorage // user info from local storage if available
      ? await JSON.parse(userActivityFromLocalStorage)
      : userActivityInfo && userActivityInfo.data();

    !userActivityFromLocalStorage &&
      localStorage.setItem("userActivity", JSON.stringify(newUserActivityInfo));

    return newUserActivityInfo;
  } catch (err) {
    store.dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
    console.error(err);
    return false;
  }
};

export const loadLoggedInUser = async (): Promise<void> => {
  const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const userInfo = await getUserInfo(user.uid);
        const userActivity = await getUserActivityInfo(user.uid);

        userInfo &&
          store.dispatch(populateUserData({ ...userInfo, loggedIn: true }));
        userActivity && store.dispatch(populateUserActivity(userActivity));
        store.dispatch(
          addUserAvatarById({
            userId: user.uid,
            avatarUrl: userInfo ? userInfo.profileAvatar : "",
          })
        );
        store.dispatch(changeLoggedIn(true));
        store.dispatch(setLoading(false));
        unsubscribe();
      } catch (err) {
        store.dispatch(
          setNotification({ text: customFirebaseErrorMessage(err) })
        );
        store.dispatch(setLoading(false));
        unsubscribe();
        console.error(err);
      }
    } else {
      store.dispatch(changeLoggedIn(false));
      store.dispatch(setLoading(false));
      unsubscribe();
    }
  });
};

export const getUserAvatarUrlById = async (userId: string): Promise<string> => {
  try {
    let avatarUrl: string | null = null;
    const profileAvatars = store.getState().userProfiles.profileAvatars;
    profileAvatars.forEach((profile) => {
      if (profile.userId === userId) avatarUrl = profile.avatarUrl;
    });
    if (avatarUrl !== null) return avatarUrl; // if found return avatarUrl
    avatarUrl = await storageRef
      .child(`userAvatars/${userId}`)
      .getDownloadURL();
    store.dispatch(addUserAvatarById({ userId, avatarUrl: avatarUrl || "" }));
    return avatarUrl || ""; // If url is found return it, if not return empty string
  } catch (err) {
    err.code === "storage/object-not-found"
      ? store.dispatch(addUserAvatarById({ userId, avatarUrl: "" }))
      : console.error(err.message);
    return "";
  }
};

export const changePassword = async (passwordInfo: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<boolean> => {
  const { currentPassword, newPassword, confirmPassword } = passwordInfo;
  const user = firebaseAuth.currentUser;

  if (user) {
    store.dispatch(setRequestActive(true));
    const email = user.email!;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      email,
      currentPassword
    );
    try {
      await user.reauthenticateWithCredential(credentials); // reauthenticate to confirm the user provided password
      try {
        newPassword === confirmPassword &&
          (await user.updatePassword(newPassword)); // update password
        store.dispatch(
          setNotification({
            text: getNotificationMessage("password-change-success"),
          })
        );
        store.dispatch(setRequestActive(true));
        return true;
      } catch (err) {
        store.dispatch(
          setNotification({ text: customFirebaseErrorMessage(err) })
        );
        store.dispatch(setRequestActive(false));
        console.error(err);
        return false;
      }
    } catch (err) {
      store.dispatch(
        setNotification({ text: customFirebaseErrorMessage(err) })
      );
      store.dispatch(setRequestActive(false));
      console.error(err);
      return false;
    }
  } else {
    store.dispatch(setRequestActive(false));
    return false;
  }
};

export const checkIfCreatorIsCurrentUser = (userId: string): boolean => {
  if (firebaseAuth.currentUser)
    return firebaseAuth.currentUser.uid === userId ? true : false;
  else return false;
};

export const getFirebaseUserId = (): string | null => {
  if (firebaseAuth.currentUser) return firebaseAuth.currentUser.uid;
  else return null;
};
