import { DocumentData } from "@google-cloud/firestore";
import { RecentActivitySchema } from "../../schemas";
export const LOGGED_IN = "LOGGED_IN";
export const POPULATE_USER_DATA = "POPULATE_USER_DATA";
export const INCREMENT_FOLLOWING_COUNT = "INCREMENT_FOLLOWING_COUNT";
export const DECREMENT_FOLLOWING_COUNT = "DECREMENT_FOLLOWING_COUNT";
export const USER_LOGOUT = "USER_LOGOUT";
export const ADD_RECENT_ACTIVITY = "ADD_RECENT_ACTIVITY";
export const UPDATE_PROFILE_AVATAR = "UPDATE_PROFILE_AVATAR";
export const SET_USER_SETTINGS = "SET_USER_SETTINGS";

export interface UserState {
  name: string;
  username: string;
  email: string;
  profileAvatar: string;
  userSettings: UserSettingsState;
  following: number;
  followers: number;
  minutesRead: number;
  totalTimeOfAllPosts: number;
  numberOfPublishedPosts: number;
  profileViews: number;
  numberOfImpacts: number;
  recentActivity: RecentActivitySchema[];
  createdAt: { seconds: number; nanoseconds: number } | number;
  updatedAt: { seconds: number; nanoseconds: number } | number;
  loggedIn: boolean;
}

export type SettingType =
  | "replyNotifications"
  | "allowNotifications"
  | "profileVisibility"
  | "publishedCreationsVisibility"
  | "quriosity";

export interface UserSettingsState {
  allowNotifications: boolean;
  replyNotifications: boolean;
  profileVisibility: "public" | "private";
  quriosity: boolean;
  publishedCreationsVisibility: boolean;
}

export interface IncrementFollowingCount {
  type: typeof INCREMENT_FOLLOWING_COUNT;
}

export interface DecrementFollowingCount {
  type: typeof DECREMENT_FOLLOWING_COUNT;
}

export interface UserLogout {
  type: typeof USER_LOGOUT;
}

export interface ChangeLoggedIn {
  type: typeof LOGGED_IN;
  payload: boolean;
}
export interface PopulateUserData {
  type: typeof POPULATE_USER_DATA;
  payload: DocumentData | UserState;
}

export interface AddRecentActivity {
  type: typeof ADD_RECENT_ACTIVITY;
  payload: RecentActivitySchema[];
}

export interface UpdateProfileAvatar {
  type: typeof UPDATE_PROFILE_AVATAR;
  payload: string;
}

export interface SetUserSettings {
  type: typeof SET_USER_SETTINGS;
  payload: { settingType: SettingType; updateTo: boolean };
}

export interface UpdateUserSettings {
  settingType: SettingType;
  updateTo: boolean;
}

export type UserActionTypes =
  | ChangeLoggedIn
  | PopulateUserData
  | IncrementFollowingCount
  | DecrementFollowingCount
  | AddRecentActivity
  | UpdateProfileAvatar
  | SetUserSettings;
