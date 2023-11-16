import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ArrowLeft } from "../helperComponents/svgIcons";

const Header: React.FC = () => {
  const path = useLocation().pathname;
  const pathArray = path.split("/");
  const pageName = pathArray[pathArray.length - 1];
  const goBackLink =
    pageName === "sign-in"
      ? "/"
      : pageName === "login"
      ? "/sign-in"
      : pageName === "forgot-password"
      ? "/sign-in/login"
      : pageName === "reset-password"
      ? "/sign-in/forgot-password"
      : "/sign-in";

  const history = useHistory();
  return (
    <div className={`header${pageName === "register" ? " dark" : ""}`}>
      <div
        className="header-button"
        onClick={() =>
          pageName !== "change-password"
            ? history.push(goBackLink)
            : history.goBack()
        }
      >
        <ArrowLeft />
      </div>
      <h2 className="header-title">{pageName.replace("-", " ")}</h2>
    </div>
  );
};

export default Header;
