import React from "react";
import { ArrowDown } from "../../../helperComponents/svgIcons";

interface PostInfoProps {
  description: string;
  hashtags: string[];
  genre: string[];
  views: number;
  estimatedTimeToRead: number;
  postInfoRef: React.MutableRefObject<HTMLDivElement | null>;
  isDescriptionHidden: boolean;
  setIsDescriptionHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostInfo: React.FC<PostInfoProps> = ({
  description,
  hashtags,
  genre,
  views,
  estimatedTimeToRead,
  postInfoRef,
  isDescriptionHidden,
  setIsDescriptionHidden,
}) => {
  return (
    <section className="post-info" ref={postInfoRef}>
      {description && (
        <div
          className={`post-info-description${
            !isDescriptionHidden ? " show" : ""
          }`}
        >
          <div
            className="post-info-description-title"
            onClick={() => setIsDescriptionHidden(!isDescriptionHidden)}
          >
            <p className="title">Description</p>
            <ArrowDown />
          </div>
          <p className="post-info-description-text">{description}</p>
        </div>
      )}
      {hashtags.length > 0 && (
        <div className="post-info-hashtags">
          {hashtags.map((hashtag, i) => (
            <p className="hashtag" key={i}>
              {hashtag}
            </p>
          ))}
        </div>
      )}
      <div className="post-info-genre">
        {genre.map((g, i) => (i !== genre.length - 1 ? `${g}, ` : g))}
      </div>
      <div className="post-info-statistics">
        <div className="views">{views.toLocaleString()} views</div>
        <div className="read-time">{estimatedTimeToRead} min read</div>
      </div>
    </section>
  );
};

export default PostInfo;
