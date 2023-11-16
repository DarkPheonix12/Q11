import React from "react";
import { useHistory } from "react-router";
import { BookmarkIcon, LockIcon, StatsIcon, UnlockedIcon } from "../svgIcons";
import UserImageRounded from "../UserImageRounded";

interface CardHeaderProps {
  type: "story" | "book" | "blog" | "poem" | "journal" | "ad";
  page: "home" | "library" | "published" | "unpublished";
  imgSrc?: string;
  userImageRef: React.MutableRefObject<HTMLImageElement | null>;
  avatar: string;
  username: string;
  isBookmarked?: boolean;
  privatePost?: boolean;
  bookmarkButton: React.RefObject<HTMLDivElement>;
  statsButton: React.RefObject<HTMLDivElement>;
  privatePostButton: React.RefObject<HTMLDivElement>;
  setHideModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  page,
  imgSrc,
  userImageRef,
  avatar,
  username,
  type,
  privatePost,
  isBookmarked = false,
  bookmarkButton,
  privatePostButton,
  statsButton,
  setHideModal,
}) => {
  const handleBookmark = () => {
    console.log("bookmarked");
  };

  const history = useHistory();
  return (
    <div className="card-header">
      {page === "home" && (
        <>
          <div
            className={`card-bookmark${isBookmarked ? " bookmarked" : ""}`}
            onClick={() => handleBookmark()}
            ref={bookmarkButton}
          >
            <BookmarkIcon />
          </div>
          {imgSrc && <img src={imgSrc} alt="" className="card-img" />}
        </>
      )}

      {page === "published" && (
        <div className="card-header-icons">
          <div
            className="icon"
            onClick={() => setHideModal && setHideModal(false)}
            ref={statsButton}
          >
            <StatsIcon />
          </div>
          <div className="icon" ref={privatePostButton}>
            {privatePost ? <LockIcon /> : <UnlockedIcon />}
          </div>
        </div>
      )}
      <div
        className="user-img"
        onClick={() => history.push(`/home/user/${username}`)}
        ref={userImageRef}
      >
        <UserImageRounded
          src={avatar}
          className={`card-avatar${page === "home" && imgSrc ? " w-img" : ""}`}
        />
      </div>

      <h2 className="card-type">{type}</h2>
    </div>
  );
};

export default CardHeader;
