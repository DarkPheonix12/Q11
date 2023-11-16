import React from "react";
import { useLocation } from "react-router-dom";
import { useOnKeyboardOpen } from "../../../helperFunctions/customHooks";

const Circles: React.FC = () => {
  const [keyboardState] = useOnKeyboardOpen();
  const path = useLocation().pathname;
  const pathArray = path.split("/");
  const pageName = pathArray[pathArray.length - 1];
  return (
    <div
      className={`circles${
        pageName === "sign-in" || pageName === "register" ? " w-footer" : ""
      }${keyboardState ? " keyboard-open" : ""}`}
    >
      <img
        src={`/img/${
          pageName === "register"
            ? "register-background.png"
            : "login-background.png"
        }`}
        alt="background"
      />
    </div>
  );
};

export default Circles;
