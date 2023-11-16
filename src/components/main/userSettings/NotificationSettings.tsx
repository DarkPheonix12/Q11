import React from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  RootState,
  updateUserSetting,
  UpdateUserSettings,
  SettingType,
  UserSettingsState,
} from "../../../redux";
import SettingsItem from "./SettingsItem";

interface NotificationSettingsProps {
  userSettings: UserSettingsState;
  updateUserSetting: (update: UpdateUserSettings) => Promise<boolean>;
}

const settings: {
  settingType: SettingType;
  settingTitle: string;
  description: string;
}[] = [
  {
    settingType: "allowNotifications",
    settingTitle: "Allow Notifications",
    description: "Adjust all notification settings",
  },
  {
    settingType: "replyNotifications",
    settingTitle: "New Reply Notifications",
    description:
      "Adjust when you get notified when there are New Replies to your Questions",
  },
];

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  userSettings,
  updateUserSetting,
}) => {
  return (
    <section className="settings">
      <h2 className="settings-header">GENERAL</h2>
      {settings.map((setting, i) => {
        return (
          <SettingsItem
            settingType={setting.settingType}
            settingTitle={setting.settingTitle}
            description={setting.description}
            on={
              setting.settingType === "profileVisibility"
                ? userSettings[setting.settingType] === "private"
                  ? true
                  : false
                : userSettings[setting.settingType]
            }
            key={i}
            action={updateUserSetting}
          />
        );
      })}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  userSettings: state.user.userSettings,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  updateUserSetting: (update: UpdateUserSettings) =>
    dispatch(updateUserSetting(update)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationSettings);
