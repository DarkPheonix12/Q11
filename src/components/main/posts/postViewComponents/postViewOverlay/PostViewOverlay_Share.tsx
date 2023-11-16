import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useHideOnOutsideElementClick } from "../../../../../helperFunctions/customHooks";
import { shareLink } from "../../../../../helperFunctions/userActions";
import { PaperClipIcon } from "../../../../helperComponents/svgIcons";

interface PostViewOverlayShareProps {
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostViewOverlayShare: React.FC<PostViewOverlayShareProps> = ({
  isHidden,
  setIsHidden,
}) => {
  const [link, setLink] = useState<string>("");
  const shareElementRef = useRef<HTMLDivElement | null>(null);
  const pathname = useLocation().pathname;
  useHideOnOutsideElementClick(shareElementRef, setIsHidden);

  useEffect(() => {
    const urlObject = window.location;
    setLink(`${urlObject.protocol}//${urlObject.host}${pathname}`);
  }, [pathname]);

  return (
    <div
      className={`post-overlay-share${isHidden ? " hide" : ""}`}
      ref={shareElementRef}
    >
      <div className="share">
        <div className="icon">
          <PaperClipIcon />
        </div>
        <p className="link">{link}</p>
        <button className="btn btn-secondary" onClick={() => shareLink()}>
          Copy
        </button>
      </div>
    </div>
  );
};

export default PostViewOverlayShare;
