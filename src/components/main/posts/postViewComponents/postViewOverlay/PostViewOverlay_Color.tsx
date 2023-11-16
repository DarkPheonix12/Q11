import React, { useEffect, useRef } from "react";
import { useHideOnOutsideElementClick } from "../../../../../helperFunctions/customHooks";
import {
  getLocalPostViewSettings,
  updateLocalPostViewSettings,
} from "../../../../../helperFunctions/localStorageActions";
import { LocalPostViewSettings } from "../../../../../types";

interface PostViewOverlayColorProps {
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setPostBackgroundColor: React.Dispatch<
    React.SetStateAction<"gray" | "yellow" | "dark" | null>
  >;
  setIsOverlayHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSOHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostViewOverlayColor: React.FC<PostViewOverlayColorProps> = ({
  isHidden,
  setIsHidden,
  setPostBackgroundColor,
  setIsOverlayHidden,
  setIsSOHidden,
}) => {
  const colorElementRef = useRef<HTMLDivElement | null>(null);
  useHideOnOutsideElementClick(colorElementRef, setIsHidden);

  const handleSetPostBackgroundColor = (
    color: LocalPostViewSettings["postBackgroundColor"]
  ) => {
    setPostBackgroundColor(color);
    updateLocalPostViewSettings("postBackgroundColor", color);
    setIsOverlayHidden(true);
    setIsSOHidden(true);
  };

  useEffect(() => {
    setPostBackgroundColor(getLocalPostViewSettings("postBackgroundColor"));

    return () => {
      setPostBackgroundColor(null);
    };
  }, [setPostBackgroundColor]);
  return (
    <div
      className={`post-overlay-color${isHidden ? " hide" : ""}`}
      ref={colorElementRef}
    >
      <div
        className="color white"
        onClick={() => handleSetPostBackgroundColor(null)}
      ></div>

      <div
        className="color yellow"
        onClick={() => handleSetPostBackgroundColor("yellow")}
      ></div>

      <div
        className="color gray"
        onClick={() => handleSetPostBackgroundColor("gray")}
      ></div>

      <div
        className="color dark"
        onClick={() => handleSetPostBackgroundColor("dark")}
      ></div>
    </div>
  );
};

export default PostViewOverlayColor;
