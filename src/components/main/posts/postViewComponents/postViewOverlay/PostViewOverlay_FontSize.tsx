import React, { useEffect, useRef } from "react";
import { useHideOnOutsideElementClick } from "../../../../../helperFunctions/customHooks";
import {
  getLocalPostViewSettings,
  updateLocalPostViewSettings,
} from "../../../../../helperFunctions/localStorageActions";
import { LocalPostViewSettings } from "../../../../../types";

interface PostViewOverlayFontSizeProps {
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setFontSize: React.Dispatch<
    React.SetStateAction<LocalPostViewSettings["fontSize"] | null>
  >;
  fontSize: LocalPostViewSettings["fontSize"] | null;
}

const PostViewOverlayFontSize: React.FC<PostViewOverlayFontSizeProps> = ({
  isHidden,
  setIsHidden,
  setFontSize,
  fontSize,
}) => {
  const fontSizeElementRef = useRef<HTMLDivElement | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    if (isNaN(parseInt(e.target.value))) return;
    if (parseInt(e.target.value) < 10) return;
    if (parseInt(e.target.value) > 25) return;
    const value = parseInt(e.target.value) as LocalPostViewSettings["fontSize"];
    setFontSize(value);
    updateLocalPostViewSettings("fontSize", value);
  };

  useEffect(() => {
    setFontSize(getLocalPostViewSettings("fontSize"));
  }, [setFontSize]);

  useHideOnOutsideElementClick(fontSizeElementRef, setIsHidden);
  return (
    <div
      className={`post-overlay-fontsize${isHidden ? " hide" : ""}`}
      ref={fontSizeElementRef}
    >
      <div className="font-size">
        <input
          type="range"
          name="fontSize"
          min={10}
          max={25}
          step={1}
          value={fontSize ? fontSize : 15}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default PostViewOverlayFontSize;
