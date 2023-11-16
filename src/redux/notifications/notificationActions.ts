import {
  Notification,
  RemoveNotification,
  SetNotification,
} from "./notificationTypes";

export const setNotification = (payload: Notification): SetNotification => ({
  type: "SET_NOTIFICATION",
  payload,
});

export const removeNotification = (): RemoveNotification => ({
  type: "REMOVE_NOTIFICATION",
});
