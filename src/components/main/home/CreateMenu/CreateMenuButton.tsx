import React from "react";
import { useHistory } from "react-router-dom";

interface CreateMenuButtonProps {
  text: string;
  link: string;
  icon: JSX.Element;
}

const CreateMenuButton: React.FC<CreateMenuButtonProps> = React.memo(
  ({ text, link, icon }) => {
    const history = useHistory();
    return (
      <div className="create-menu-button" onClick={() => history.push(link)}>
        <div className="create-menu-button-text btn btn-round">{text}</div>
        <div className="create-menu-button-icon">{icon}</div>
      </div>
    );
  }
);

export default CreateMenuButton;
