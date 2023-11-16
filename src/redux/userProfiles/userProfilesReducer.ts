import {
  addObjectToArrayIfUnique,
  makeArrayOfObjectsUnique,
} from "../../helperFunctions";
import {
  UserProfilesActionTypes,
  UserProfilesState,
} from "./userProfilesTypes";

const userProfilesState: UserProfilesState = {
  followers: [],
  following: [],
  hasMoreFollowers: true,
  hasMoreFollowing: true,
  lastFollowerDocRef: null,
  lastFollowingArrayRef: "",
  profiles: [],
  profileAvatars: [],
  loading: true,
};

const userProfilesReducer = (
  state = userProfilesState,
  action: UserProfilesActionTypes
): UserProfilesState => {
  switch (action.type) {
    case "ADD_USER_PROFILE":
      return {
        ...state,
        profiles: addObjectToArrayIfUnique(
          [...state.profiles],
          action.payload,
          "userId"
        ),
      };
    case "ADD_USER_AVATAR_BY_ID":
      return {
        ...state,
        profileAvatars: addObjectToArrayIfUnique(
          [...state.profileAvatars],
          action.payload,
          "userId"
        ),
      };

    case "INCREMENT_FOLLOWERS__USER_PROFILES":
      return {
        ...state,
        profiles: state.profiles.map((profile) => {
          if (profile.userId === action.payload) {
            return { ...profile, followers: profile.followers + 1 };
          } else return profile;
        }),

        followers: state.followers.map((profile) => {
          if (profile.userId === action.payload) {
            return { ...profile, followers: profile.followers + 1 };
          } else return profile;
        }),

        following: state.following.map((profile) => {
          if (profile.userId === action.payload) {
            return { ...profile, followers: profile.followers + 1 };
          } else return profile;
        }),
      };

    case "DECREMENT_FOLLOWERS__USER_PROFILES":
      return {
        ...state,
        profiles: state.profiles.map((profile) => {
          if (profile.userId === action.payload) {
            return { ...profile, followers: profile.followers - 1 };
          } else return profile;
        }),

        followers: state.followers.map((profile) => {
          if (profile.userId === action.payload) {
            return { ...profile, followers: profile.followers - 1 };
          } else return profile;
        }),

        following: state.following.map((profile) => {
          if (profile.userId === action.payload) {
            return { ...profile, followers: profile.followers - 1 };
          } else return profile;
        }),
      };

    case "CHANGE_FOLLOWED_BY_CURRENT_USER":
      return {
        ...state,
        profiles: state.profiles.map((profile) => {
          if (profile.userId === action.payload) {
            return {
              ...profile,
              isFollowedByCurrentUser: !profile.isFollowedByCurrentUser,
            };
          } else return profile;
        }),

        followers: state.followers.map((profile) => {
          if (profile.userId === action.payload) {
            return {
              ...profile,
              isFollowedByCurrentUser: !profile.isFollowedByCurrentUser,
            };
          } else return profile;
        }),

        following: state.following.map((profile) => {
          if (profile.userId === action.payload) {
            return {
              ...profile,
              isFollowedByCurrentUser: !profile.isFollowedByCurrentUser,
            };
          } else return profile;
        }),
      };

    case "LOADING_PROFILE":
      return {
        ...state,
        loading: action.payload,
      };

    case "POPULATE_FOLLOWERS":
      return {
        ...state,
        followers: [...state.followers, ...action.payload],
      };

    case "POPULATE_FOLLOWING":
      return {
        ...state,
        following: makeArrayOfObjectsUnique(
          [...state.following, ...action.payload],
          "userId"
        ),
      };

    case "ADD_USER_TO_FOLLOWING":
      return {
        ...state,
        following: addObjectToArrayIfUnique(
          [...state.following],
          action.payload,
          "userId"
        ),
      };

    case "SET_LAST_FOLLOWER_DOC_REF":
      return {
        ...state,
        lastFollowerDocRef: action.payload,
      };
    case "SET_LAST_FOLLOWING_ARRAY_REF":
      return {
        ...state,
        lastFollowingArrayRef: action.payload,
      };

    case "CHANGE_HAS_MORE_FOLLOWERS":
      return {
        ...state,
        hasMoreFollowers: action.payload,
      };

    case "CHANGE_HAS_MORE_FOLLOWING":
      return {
        ...state,
        hasMoreFollowing: action.payload,
      };

    default:
      return state;
  }
};

export default userProfilesReducer;
