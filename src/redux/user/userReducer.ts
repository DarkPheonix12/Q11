import { UserActionTypes, UserState } from "./userTypes";

const userState: UserState = {
  name: "",
  username: "",
  email: "",
  profileAvatar: "",
  userSettings: {
    allowNotifications: true,
    replyNotifications: true,
    profileVisibility: "public",
    quriosity: true,
    publishedCreationsVisibility: true,
  },
  following: 0,
  followers: 0,
  minutesRead: 0,
  numberOfPublishedPosts: 0,
  profileViews: 0,
  numberOfImpacts: 0,
  recentActivity: [],
  createdAt: { seconds: 0, nanoseconds: 0 },
  updatedAt: { seconds: 0, nanoseconds: 0 },
  totalTimeOfAllPosts: 0,
  loggedIn: false,
};

const userReducer = (state = userState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case "LOGGED_IN":
      return {
        ...state,
        loggedIn: action.payload,
      };

    case "POPULATE_USER_DATA":
      const {
        name,
        username,
        email,
        profileAvatar,
        userSettings,
        following,
        followers,
        minutesRead,
        numberOfPublishedPosts,
        profileViews,
        numberOfImpacts,
        recentActivity,
        createdAt,
        updatedAt,
      } = action.payload;
      return {
        ...state,
        name: name || "",
        username: username || "",
        email: email || "",
        profileAvatar: profileAvatar || "",
        userSettings: userSettings || {
          allowNotifications: true,
          replyNotifications: true,
          profileVisibility: "public",
          quriosity: true,
          publishedCreationsVisibility: true,
        },
        following: following || 0,
        followers: followers || 0,
        minutesRead: minutesRead || 0,
        numberOfPublishedPosts: numberOfPublishedPosts || 0,
        profileViews: profileViews || 0,
        numberOfImpacts: numberOfImpacts || 0,
        recentActivity: recentActivity || [],
        createdAt: createdAt || { seconds: 0, nanoseconds: 0 },
        updatedAt: updatedAt || { seconds: 0, nanoseconds: 0 },
        totalTimeOfAllPosts: 0,
      };

    case "INCREMENT_FOLLOWING_COUNT":
      return {
        ...state,
        following: state.following + 1,
      };

    case "DECREMENT_FOLLOWING_COUNT":
      return {
        ...state,
        following: state.following - 1,
      };

    case "ADD_RECENT_ACTIVITY":
      return {
        ...state,
        recentActivity: action.payload,
      };

    case "UPDATE_PROFILE_AVATAR":
      return {
        ...state,
        profileAvatar: action.payload,
      };

    case "SET_USER_SETTINGS":
      // if the settingType is profileVisibility updateTo needs to be "private" if true and "public" if false
      const updateTo =
        action.payload.settingType === "profileVisibility"
          ? action.payload.updateTo
            ? "private"
            : "public"
          : action.payload.updateTo;
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          [action.payload.settingType]: updateTo,
        },
      };

    default:
      return state;
  }
};

export default userReducer;
