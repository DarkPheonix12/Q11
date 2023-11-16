import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Post } from "../../../redux";
import PostStatsModal from "../modals/PostStatsModal";
import CardContent from "./CardContent";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import CardReadingProgress from "./CardReadingProgress";

interface PostCardProps {
  page: "home" | "library" | "published" | "unpublished";
  postInfo: Post;
  lastCardDivRef?: (node: HTMLDivElement) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  page,
  postInfo,
  lastCardDivRef,
}) => {
  const {
    type,
    id,
    title,
    contentSnippet,
    description,
    averageRating,
    views,
    img,
    author,
    createdBy: { userAvatar },
    createdAt,
    updatedAt,
    isBookmarked,
    isPrivate,
  } = postInfo;

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      e.target !== bookmarkButton.current &&
      e.target !== statsButton.current &&
      e.target !== privatePostButton.current &&
      e.target !== userImageRef.current
    )
      page === "unpublished"
        ? history.push(`/edit/${id}`)
        : history.push(`/post/${id}`);
  };

  const history = useHistory();
  const bookmarkButton = useRef<HTMLDivElement | null>(null);
  const statsButton = useRef<HTMLDivElement | null>(null);
  const privatePostButton = useRef<HTMLDivElement | null>(null);
  const userImageRef = useRef<HTMLImageElement | null>(null);
  const [hideModal, setHideModal] = useState(true);
  return (
    <div
      className={`${
        page === "home" && img ? "card card-w-img" : "card"
      } ${type} ${page === "library" ? "library" : ""}`}
      onClick={(e) => handleCardClick(e)}
      ref={lastCardDivRef || null}
    >
      <>
        <CardHeader
          imgSrc={img}
          userImageRef={userImageRef}
          avatar={userAvatar}
          username={author}
          isBookmarked={isBookmarked}
          privatePost={isPrivate}
          page={page}
          type={type}
          bookmarkButton={bookmarkButton}
          statsButton={statsButton}
          privatePostButton={privatePostButton}
          setHideModal={setHideModal}
        />

        <CardContent
          title={title}
          text={description ? description : contentSnippet}
          page={page}
          type={type}
        />

        <CardFooter
          page={page}
          type={type}
          views={views}
          rating={[averageRating]}
          minutesRead={360}
          dateCreated={createdAt}
          dateUpdated={updatedAt}
        />
        {page === "library" && (
          <CardReadingProgress totalPages={0} pagesRead={0} />
        )}
        {page === "published" && !hideModal && (
          <PostStatsModal
            hide={hideModal}
            setHideModal={setHideModal}
            numberOfRatings={postInfo.numberOfRatings}
            views={postInfo.views}
            numberOfShares={postInfo.numberOfShares}
            numberOfBookmarks={postInfo.numberOfBookmarks}
          />
        )}
      </>
    </div>
  );
};

export default PostCard;
