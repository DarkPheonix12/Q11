import React from "react";
import { useLocation } from "react-router-dom";
import { useOnKeyboardOpen } from "../../helperFunctions/customHooks";

interface FooterProps {
  landing: boolean;
}

const Footer: React.FC<FooterProps> = ({ landing }) => {
  const [keyboardState] = useOnKeyboardOpen();
  const path = useLocation().pathname;
  return (
    <div className={`footer${keyboardState ? " hidden" : ""}`}>
      <p
        className={`footer-text${
          path === "/sign-in/register" ? " footer-register-text" : ""
        }`}
      >
        {landing ? "By Signing Up" : "By publishing"}, you agree to our{" "}
        <a href="#!">Terms</a> & <a href="#!">Privacy Policy,</a> <br />
        &copy; Qalki, Inc. All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
