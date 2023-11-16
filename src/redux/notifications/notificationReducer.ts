import {
  NotificationState,
  NotificationActionTypes,
} from "./notificationTypes";

const notificationState: NotificationState = {
  notification: {
    text: "",
    showNotification: false,
  },
};

const notificationReducer = (
  state = notificationState,
  action: NotificationActionTypes
): NotificationState => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return {
        ...state,
        notification: { ...action.payload, showNotification: true },
      };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notification: { text: "", showNotification: false },
      };

    default:
      return state;
  }
};

export default notificationReducer;
