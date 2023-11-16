import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useHideOnOutsideElementClick } from "../../../../../helperFunctions/customHooks";

interface PostViewOverlayBookmarksProps {
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const bookmarks = [
  { page: 1 },
  { page: 103 },
  { page: 25 },
  { page: 63 },
  { page: 567 },
  { page: 92 },
  { page: 93 },
  { page: 94 },
  { page: 95 },
];

const PostViewOverlayBookmarks: React.FC<PostViewOverlayBookmarksProps> = ({
  isHidden,
  setIsHidden,
}) => {
  const bookmarkElementRef = useRef<HTMLDivElement | null>(null);
  useHideOnOutsideElementClick(bookmarkElementRef, setIsHidden);

  // Make bookmarks hidden on render - important for "Swiper" calculations
  useEffect(() => setIsHidden(true), [setIsHidden]);
  return (
    <div
      className={`post-overlay-bookmarks${isHidden ? " hide" : ""}`}
      ref={bookmarkElementRef}
    >
      <Swiper
        className="bookmark-list"
        freeMode={true}
        speed={150}
        roundLengths={true}
        slidesPerView="auto"
      >
        {bookmarks.map((bookmark, i) => (
          <SwiperSlide key={i}>
            <div className="bookmark" key={i}>
              {bookmark.page}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PostViewOverlayBookmarks;
