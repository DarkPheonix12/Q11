import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getPageName } from "../../helperFunctions";
import HeaderSearchBar from "../helperComponents/HeaderSearchBar";
import {
  ArrowLeft,
  QuestionMarkIcon,
  SearchIcon,
} from "../helperComponents/svgIcons";
import SideDrawer from "./SideDrawer";

const Header: React.FC = () => {
  const [hideSearchBar, toggleSearchBar] = useState(true);
  const [hideMenu, toggleMenu] = useState(true);
  const path = useLocation().pathname;
  const pageName = getPageName(path);

  useEffect(() => {
    path === "/" && toggleSearchBar((h) => false);

    const sideDrawer = document.querySelector(".side-drawer");
    const hideSearchBarOnOutsideClick = (e: MouseEvent) =>
      sideDrawer && !sideDrawer.contains(e.target as Node) && toggleMenu(true);
    document.addEventListener("mousedown", hideSearchBarOnOutsideClick);
    return () =>
      document.removeEventListener("mousedown", hideSearchBarOnOutsideClick);
  }, [path]);

  useEffect(() => {});

  const header = useRef<HTMLElement>(null);
  const history = useHistory();
  return (
    <>
      <section
        className={`main-header${
          path === "/" || path === "/library" ? " shadow" : ""
        }`}
        ref={header}
      >
        <HeaderSearchBar
          hideSearchBar={hideSearchBar}
          toggleSearchBar={toggleSearchBar}
          path={path}
        />

        {hideSearchBar && (
          <React.Fragment>
            <div className="header-buttons-left">
              {path.match("/answer") ||
              path.match("/question") ||
              path.match("/user") ||
              path.match("/followers") ||
              path.match("/following") ? (
                <div className="header-button" onClick={() => history.goBack()}>
                  <ArrowLeft />
                </div>
              ) : (
                <div
                  className="header-button menu-button"
                  onClick={() => toggleMenu(!hideMenu)}
                >
                  <div className="menu-line"></div>
                  <div className="menu-line"></div>
                  <div className="menu-line"></div>
                </div>
              )}
            </div>
            <h1 className="header-title">{pageName}</h1>
            <div className="header-buttons-right">
              <div
                className="search-button"
                onClick={() => toggleSearchBar(!hideSearchBar)}
              >
                <SearchIcon />
              </div>
              <div className="report-button">
                <QuestionMarkIcon />
              </div>
            </div>
          </React.Fragment>
        )}
      </section>
      <SideDrawer hideMenu={hideMenu} toggleMenu={toggleMenu} />
    </>
  );
};

export default Header;
