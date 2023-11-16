export const SET_NOTIFICATION = "SET_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";

export interface Notification {
  text: string;
  showNotification?: boolean;
}

export interface NotificationState {
  notification: Notification;
}

export interface SetNotification {
  type: typeof SET_NOTIFICATION;
  payload: Notification;
}

export interface RemoveNotification {
  type: typeof REMOVE_NOTIFICATION;
}

export type NotificationActionTypes = SetNotification | RemoveNotification;
