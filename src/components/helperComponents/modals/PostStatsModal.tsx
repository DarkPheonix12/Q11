import React, { useEffect, useRef } from "react";
import {
  BookmarkIcon,
  RatingStarIcon,
  ShareIcon,
  ViewsIcon,
} from "../svgIcons";

interface PostStatsModalProps {
  hide: boolean;
  setHideModal: React.Dispatch<React.SetStateAction<boolean>>;
  numberOfRatings: number;
  views: number;
  numberOfShares: number;
  numberOfBookmarks: number;
}

const PostStatsModal: React.FC<PostStatsModalProps> = ({
  hide,
  setHideModal,
  numberOfBookmarks,
  numberOfShares,
  views,
  numberOfRatings,
}) => {
  useEffect(() => {
    const hideLoginOnOutsideClick = (e: any) => {
      modalDiv &&
        modalDiv.current &&
        !modalDiv.current.contains(e.target) &&
        setHideModal(true);
    };

    document.addEventListener("mousedown", hideLoginOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", hideLoginOnOutsideClick);
      setHideModal(true);
    };
  }, [setHideModal]);

  const modalDiv = useRef<HTMLDivElement>(null);
  return (
    <section className={`modal-wrapper${hide ? " hide" : ""}`}>
      <section className="modal post-stats-modal" ref={modalDiv}>
        <h2 className="title">Statistics</h2>
        <div className="stats">
          <div className="stat">
            <div className="icon">
              <RatingStarIcon />
            </div>
            <div className="stat-number">
              {numberOfRatings.toLocaleString()}
            </div>
          </div>
          <div className="stat">
            <div className="icon">
              <ViewsIcon />
            </div>
            <div className="stat-number">{views.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="icon">
              <ShareIcon />
            </div>
            <div className="stat-number">{numberOfShares.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="icon">
              <BookmarkIcon />
            </div>
            <div className="stat-number">
              {numberOfBookmarks.toLocaleString()}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default PostStatsModal;
