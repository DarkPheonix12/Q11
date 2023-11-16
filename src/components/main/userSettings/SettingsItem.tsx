import React from "react";
import { SettingType, UpdateUserSettings } from "../../../redux";

interface SettingsItemProps {
  settingType: SettingType;
  settingTitle: string;
  description: string;
  on: boolean;
  action: (update: UpdateUserSettings) => Promise<boolean>;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  settingType,
  settingTitle,
  description,
  on,
  action,
}) => {
  return (
    <div className="settings-item w-btn">
      <div className="settings-info">
        <div className="settings-name">{settingTitle}</div>
        <p className="settings-description">{description}</p>
      </div>
      <div
        className={`btn${on ? " btn-on" : " btn-off"}`}
        onClick={() => action({ settingType, updateTo: !on })}
      >
        {on ? "ON" : "OFF"}
      </div>
    </div>
  );
};

export default SettingsItem;
