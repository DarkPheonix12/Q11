import { DocumentData } from "@google-cloud/firestore";
import { RecentActivitySchema } from "../../schemas";
import firebase from "../../firebase";

export const ADD_USER_PROFILE = "ADD_USER_PROFILE";
export const ADD_USER_AVATAR_BY_ID = "ADD_USER_AVATAR_BY_ID";
export const LOADING_PROFILE = "LOADING_PROFILE";
export const INCREMENT_FOLLOWERS__USER_PROFILES =
  "INCREMENT_FOLLOWERS__USER_PROFILES";
export const DECREMENT_FOLLOWERS__USER_PROFILES =
  "DECREMENT_FOLLOWERS__USER_PROFILES";
export const CHANGE_FOLLOWED_BY_CURRENT_USER =
  "CHANGE_FOLLOWED_BY_CURRENT_USER";
export const CHANGE_HAS_MORE_FOLLOWING = "CHANGE_HAS_MORE_FOLLOWING";
export const CHANGE_HAS_MORE_FOLLOWERS = "CHANGE_HAS_MORE_FOLLOWERS";
export const SET_LAST_FOLLOWER_DOC_REF = "SET_LAST_FOLLOWER_DOC_REF";
export const SET_LAST_FOLLOWING_ARRAY_REF = "SET_LAST_FOLLOWING_ARRAY_REF";
export const POPULATE_FOLLOWERS = "POPULATE_FOLLOWERS";
export const POPULATE_FOLLOWING = "POPULATE_FOLLOWING";
export const ADD_USER_TO_FOLLOWING = "ADD_USER_TO_FOLLOWING";

export interface UserProfile {
  userId: string;
  name: string;
  username: string;
  email: string;
  profileAvatar: string;
  userSettings: {
    allowNotifications: boolean;
    replyNotifications: boolean;
    profileVisibility: "public" | "private";
    quriosity: boolean;
    publishedCreationsVisibility: boolean;
  };
  following: number;
  followers: number;
  isFollowedByCurrentUser: boolean;
  minutesRead: number;
  totalTimeOfAllPosts: number;
  numberOfPublishedPosts: number;
  profileViews: number;
  numberOfImpacts: number;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  recentActivity: RecentActivitySchema[];
}

export interface AvatarByUserId {
  userId: string;
  avatarUrl: string;
}

export interface UserProfilesState {
  following: UserProfile[];
  followers: UserProfile[];
  hasMoreFollowing: boolean;
  hasMoreFollowers: boolean;
  lastFollowerDocRef: DocumentData | null;
  lastFollowingArrayRef: string;
  profiles: UserProfile[];
  profileAvatars: AvatarByUserId[];
  loading: boolean;
}

export interface AddUserProfile {
  type: typeof ADD_USER_PROFILE;
  payload: UserProfile;
}

export interface AddUserAvatarById {
  type: typeof ADD_USER_AVATAR_BY_ID;
  payload: AvatarByUserId;
}

export interface LoadingProfile {
  type: typeof LOADING_PROFILE;
  payload: boolean;
}

export interface PopulateFollowers {
  type: typeof POPULATE_FOLLOWERS;
  payload: UserProfile[];
}

export interface AddUserToFollowing {
  type: typeof ADD_USER_TO_FOLLOWING;
  payload: UserProfile;
}

export interface PopulateFollowing {
  type: typeof POPULATE_FOLLOWING;
  payload: UserProfile[];
}

export interface IncrementFollowersUserProfiles {
  type: typeof INCREMENT_FOLLOWERS__USER_PROFILES;
  payload: string;
}

export interface DecrementFollowersUserProfiles {
  type: typeof DECREMENT_FOLLOWERS__USER_PROFILES;
  payload: string;
}

export interface ChangeHasMoreFollowing {
  type: typeof CHANGE_HAS_MORE_FOLLOWING;
  payload: boolean;
}

export interface ChangeHasMoreFollowers {
  type: typeof CHANGE_HAS_MORE_FOLLOWERS;
  payload: boolean;
}

export interface SetLastFollowerDocRef {
  type: typeof SET_LAST_FOLLOWER_DOC_REF;
  payload: DocumentData;
}

export interface SetLastFollowingArrayRef {
  type: typeof SET_LAST_FOLLOWING_ARRAY_REF;
  payload: string;
}

export interface ChangeFollowedByCurrentUser {
  type: typeof CHANGE_FOLLOWED_BY_CURRENT_USER;
  payload: string;
}

export type UserProfilesActionTypes =
  | AddUserProfile
  | AddUserAvatarById
  | LoadingProfile
  | IncrementFollowersUserProfiles
  | DecrementFollowersUserProfiles
  | ChangeHasMoreFollowing
  | ChangeHasMoreFollowers
  | SetLastFollowerDocRef
  | SetLastFollowingArrayRef
  | PopulateFollowers
  | PopulateFollowing
  | AddUserToFollowing
  | ChangeFollowedByCurrentUser;
