import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { removeNotification, Notification } from "../../redux";
import { RootState } from "../../redux/rootReducer";

interface NotificationsProps {
  notification: Notification;
  removeNotification: typeof removeNotification;
}

const Notifications: React.FC<NotificationsProps> = ({
  notification,
  removeNotification,
}) => {
  const [isHidden, toggleNotif] = useState(true);
  useEffect(() => {
    if (notification.text !== "") {
      toggleNotif(false);
      const toggleTimeout = setTimeout(() => toggleNotif(true), 2000);
      const removeNotifTimeout = setTimeout(() => {
        removeNotification();
      }, 2600); // toggleNotif Timeout + Animation Time x2
      return () => {
        clearTimeout(toggleTimeout);
        clearTimeout(removeNotifTimeout);
      };
    }
  }, [removeNotification, notification.text]);

  return (
    <div className={isHidden ? "notification" : "notification show"}>
      {notification.showNotification && (
        <p className="notification-text">{notification.text}</p>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  notification: state.notifications.notification,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  removeNotification: () => dispatch(removeNotification()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
