import React, { useEffect, useRef, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { LocalPostViewSettings } from "../../../../../types";
import {
  BookmarkIcon,
  ColorPaletIcon,
  FontSizeIcon,
  ScreenOrientationIcon,
  SearchIcon,
  ShareIcon,
} from "../../../../helperComponents/svgIcons";
import PostViewOverlayBookmarks from "./PostViewOverlay_Bookmarks";
import PostViewOverlayColor from "./PostViewOverlay_Color";
import PostViewOverlayFontSize from "./PostViewOverlay_FontSize";
import PostViewOverlaySearch from "./PostViewOverlay_Search";
import PostViewOverlayShare from "./PostViewOverlay_Share";

interface PostViewOverlayProps {
  isOverlayHidden: boolean;
  setIsOverlayHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSOHidden: React.Dispatch<React.SetStateAction<boolean>>;
  postRef: React.MutableRefObject<HTMLDivElement | null>;
  contentElement: React.MutableRefObject<HTMLDivElement | null>;
  scrollToElement: (element: HTMLElement) => void;
  setPostBackgroundColor: React.Dispatch<
    React.SetStateAction<"gray" | "yellow" | "dark" | null>
  >;
  setFontSize: React.Dispatch<
    React.SetStateAction<LocalPostViewSettings["fontSize"] | null>
  >;
  fontSize: LocalPostViewSettings["fontSize"] | null;
}

const PostViewOverlay: React.FC<PostViewOverlayProps> = ({
  isOverlayHidden,
  setIsOverlayHidden,
  setIsSOHidden,
  contentElement,
  scrollToElement,
  setPostBackgroundColor,
  setFontSize,
  fontSize,
  postRef,
}) => {
  const postOverlayRef = useRef<HTMLDivElement | null>(null);
  const [isSearchHidden, setIsSearchHidden] = useState<boolean>(true);
  const [isColorHidden, setIsColorHidden] = useState<boolean>(true);
  const [isShareHidden, setIsShareHidden] = useState<boolean>(true);
  const [isBookmarkHidden, setIsBookmarkHidden] = useState<boolean>(false); // Default = false for correct "Swiper" calculations
  const [isFontSizeHidden, setIsFontSizeHidden] = useState<boolean>(true);
  const [screenOrientation, setScreenOrientation] = useState<OrientationType>();

  const changeOrientation = async () => {
    if (!postRef.current) return;

    if (postRef.current.requestFullscreen) postRef.current.requestFullscreen();

    if (
      screenOrientation === "landscape-primary" ||
      screenOrientation === "landscape-secondary"
    ) {
      try {
        await window.screen.orientation.lock("portrait-primary");
        setScreenOrientation("portrait-primary");
      } catch (err) {
        console.log(err);
      }
    }

    if (
      screenOrientation === "portrait-primary" ||
      screenOrientation === "portrait-secondary"
    ) {
      try {
        await window.screen.orientation.lock("landscape-primary");
        setScreenOrientation("landscape-primary");
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Screen orientation change event listener
  useEffect(() => {
    !screenOrientation && setScreenOrientation(window.screen.orientation.type);
    window.screen.orientation.addEventListener("change", () =>
      setScreenOrientation(window.screen.orientation.type)
    );
    return () =>
      window.screen.orientation.removeEventListener("change", () =>
        setScreenOrientation(window.screen.orientation.type)
      );
  }, [screenOrientation]);

  useEffect(() => {
    if (!postOverlayRef.current) return;
    const postOverlay = postOverlayRef.current;
    const handleClick = (e: MouseEvent) => {
      if (e.target !== postOverlay) return;
      setIsOverlayHidden(true);
      setIsSOHidden(true);
    };
    postOverlay.addEventListener("click", handleClick);

    return () => {
      if (!postOverlay) return;
      postOverlay.removeEventListener("click", handleClick);
    };
  }, [setIsOverlayHidden, setIsSOHidden]);

  return (
    <div
      className={`post-overlay${isOverlayHidden ? " hide" : ""}`}
      ref={postOverlayRef}
    >
      <div className="post-overlay-buttons">
        {(isMobile || isTablet) && (
          <button className="btn btn-secondary" onClick={changeOrientation}>
            <ScreenOrientationIcon />
          </button>
        )}
        <div
          className="btn btn-secondary icon-size-15"
          onClick={() => setIsColorHidden(!isColorHidden)}
        >
          <ColorPaletIcon />
          <PostViewOverlayColor
            isHidden={isColorHidden}
            setIsHidden={setIsColorHidden}
            setPostBackgroundColor={setPostBackgroundColor}
            setIsOverlayHidden={setIsOverlayHidden}
            setIsSOHidden={setIsSOHidden}
          />
        </div>
        <button
          className="btn btn-secondary icon-size-13"
          onClick={() => setIsFontSizeHidden(!isFontSizeHidden)}
        >
          <FontSizeIcon />
        </button>
        <button
          className="btn btn-secondary icon-size-15"
          onClick={() => setIsSearchHidden(!isSearchHidden)}
        >
          <SearchIcon />
        </button>
        <button
          className="btn btn-secondary icon-size-13"
          onClick={() => setIsShareHidden(!isShareHidden)}
        >
          <ShareIcon />
        </button>
        <div
          className="btn btn-secondary icon-size-11"
          onClick={() => setIsBookmarkHidden(!isBookmarkHidden)}
        >
          <BookmarkIcon />
          <PostViewOverlayBookmarks
            isHidden={isBookmarkHidden}
            setIsHidden={setIsBookmarkHidden}
          />
        </div>
      </div>
      <PostViewOverlaySearch
        isHidden={isSearchHidden}
        setIsHidden={setIsSearchHidden}
        contentElement={contentElement}
        scrollToElement={scrollToElement}
      />

      <PostViewOverlayFontSize
        isHidden={isFontSizeHidden}
        setIsHidden={setIsFontSizeHidden}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <PostViewOverlayShare
        isHidden={isShareHidden}
        setIsHidden={setIsShareHidden}
      />
    </div>
  );
};
export default PostViewOverlay;
