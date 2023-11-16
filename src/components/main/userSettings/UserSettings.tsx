import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  RootState,
  SettingType,
  updateUserSetting,
  UpdateUserSettings,
  UserSettingsState,
} from "../../../redux";
import { EllipsisIcon, LockIcon } from "../../helperComponents/svgIcons";
import SettingsItem from "./SettingsItem";

interface UserSettingsProps {
  userSettings: UserSettingsState;
  updateUserSetting: (update: UpdateUserSettings) => Promise<boolean>;
}

const settings: {
  settingType: SettingType;
  settingTitle: string;
  description: string;
}[] = [
  {
    settingType: "profileVisibility",
    settingTitle: "Keep Profile Private",
    description: "Your profile won't appear on search",
  },
  {
    settingType: "quriosity",
    settingTitle: "Quriosity",
    description: "Answers won't appear on search",
  },
  {
    settingType: "publishedCreationsVisibility",
    settingTitle: "Published Creations",
    description: "Your books won't appear on search",
  },
];

const UserSettings: React.FC<UserSettingsProps> = ({
  userSettings,
  updateUserSetting,
}) => {
  const history = useHistory();
  return (
    <section className="settings">
      <div
        className="settings-item"
        onClick={() => history.push("/sign-in/change-password")}
      >
        <div className="icon">
          <LockIcon />
        </div>
        <div className="settings-name">Password</div>
        <div className="divider"></div>
      </div>
      <div className="settings-item">
        <div className="icon">
          <EllipsisIcon />
        </div>
        <div className="settings-name">More</div>
        <div className="divider"></div>
      </div>

      <h2 className="settings-header">SEARCH</h2>
      {settings.map((setting, i) => (
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
      ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
