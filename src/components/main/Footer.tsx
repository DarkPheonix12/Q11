import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useOnKeyboardOpen } from "../../helperFunctions/customHooks";
import {
  LibraryIcon,
  FireIcon,
  HomeIcon,
  ProfileIcon,
} from "../helperComponents/svgIcons";

const Footer: React.FC = () => {
  const [keyboardOpen] = useOnKeyboardOpen();
  const path = useLocation().pathname;
  const footer = useRef<HTMLElement>(null);

  // determines wheter the footer should be hideable or not based on the current page for mobile devices
  const shouldFooterHide = (): boolean => {
    if (keyboardOpen) {
      const routesToMatch = ["/home/discuss/question"];
      let shouldHide = false;
      routesToMatch.forEach((route) => {
        if (path.match(route)) shouldHide = true;
      });
      return shouldHide;
    } else return false;
  };
  return (
    <section className={`main-footer-container`}>
      <section
        className="main-footer"
        ref={footer}
        style={
          shouldFooterHide()
            ? {
                transform: `translateY(${footer.current?.offsetHeight}px)`,
                boxShadow: "none",
              }
            : {}
        }
      >
        <Link
          className={`footer-link${path === "/home" ? " current" : ""}`}
          to="/home"
        >
          <div className="icon">
            <HomeIcon />
          </div>
        </Link>

        <Link
          className={`footer-link${path === "/home/library" ? " current" : ""}`}
          to="/home/library"
        >
          <div className="icon">
            <LibraryIcon />
          </div>
        </Link>

        <Link
          className={`footer-link${
            path.match("/home/discuss") ? " current" : ""
          }`}
          to="/home/discuss/all"
        >
          <div className="icon">
            <FireIcon />
          </div>
        </Link>

        <Link
          className={`footer-link${
            path.match("/home/profile") ? " current" : ""
          }`}
          to="/home/profile"
        >
          <div className="icon">
            <ProfileIcon />
          </div>
        </Link>
      </section>
    </section>
  );
};

export default Footer;
