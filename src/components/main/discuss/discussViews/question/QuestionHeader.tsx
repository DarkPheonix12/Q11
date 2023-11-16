import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { debounce } from "../../../../../helperFunctions";
import { HeartIcon, ShareIcon } from "../../../../helperComponents/svgIcons";
import UserImageRounded from "../../../../helperComponents/UserImageRounded";

interface QuestionHeaderProps {
  questionData: {
    question: string;
    hashtags: string[];
    likes: number;
    isLiked: boolean;
    createdBy: {
      name: string;
      username: string;
      profileAvatar: string;
      userId: string;
    };
  };
  userFollowing: string[];
  currentUserUsername: string;
  handleLike: () => void;
  handleUnlike: () => void;
  handleShare: () => void;
  handleFollow: () => void;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = React.memo(
  ({
    questionData,
    userFollowing,
    currentUserUsername,
    handleLike,
    handleUnlike,
    handleShare,
    handleFollow,
  }) => {
    const {
      question,
      hashtags,
      likes,
      isLiked,
      createdBy: { name, username, profileAvatar, userId },
    } = questionData;
    const [fullText, toggleFullText] = useState(false);
    const [showFollowButton, changeShowFollowButton] = useState(false);

    const handleUserImgClick = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (e.target !== followButton.current)
        history.push(`/home/user/${username}`);
    };

    useEffect(() => {
      if (!userFollowing.includes(userId) && username !== currentUserUsername)
        changeShowFollowButton(true);
      else changeShowFollowButton(false);
    }, [userFollowing, userId, currentUserUsername, username]);

    const followButton = useRef(null);
    const history = useHistory();

    return (
      <section className="question-header">
        <div className="user-info">
          <div className="user-img" onClick={(e) => handleUserImgClick(e)}>
            <UserImageRounded src={profileAvatar} alt={name} />
            {showFollowButton && (
              <div
                className="follow-user-button"
                onClick={debounce(() => handleFollow())}
                ref={followButton}
              ></div>
            )}
          </div>
          <div className="user">
            <h2 className="full-name">{name}</h2>
            <h4 className="username">@{username}</h4>
          </div>
        </div>
        <h1
          className={`qa-text${fullText ? " full" : ""}`}
          onClick={() => toggleFullText(!fullText)}
        >
          {question}
        </h1>
        <div className="hashtags">
          {hashtags.map((hashtag, i) => (
            <div key={i} className="hashtag">
              {hashtag}
            </div>
          ))}
        </div>
        <div className="likes-share">
          <div
            className={`like-icon${isLiked ? " liked" : ""}`}
            onClick={
              isLiked
                ? debounce(() => handleUnlike())
                : debounce(() => handleLike())
            }
          >
            <HeartIcon />
          </div>
          <span className="likes-count">{likes.toLocaleString()}</span>
          <div className="share" onClick={debounce(() => handleShare())}>
            <ShareIcon />
          </div>
        </div>
      </section>
    );
  }
);

export default QuestionHeader;
