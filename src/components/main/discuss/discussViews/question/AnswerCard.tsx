import React, { useEffect, useState } from "react";
import reactStringReplace from "react-string-replace";
import { HeartIcon } from "../../../../helperComponents/svgIcons";
import UserImageRounded from "../../../../helperComponents/UserImageRounded";
import { debounce, formatNumbers } from "../../../../../helperFunctions";
import { Answer, Like, Unlike } from "../../../../../redux";
import { getUserAvatarUrlById } from "../../../../../helperFunctions/firebaseUserActions";
import { firebaseAuth } from "../../../../../firebase";
import { useHistory } from "react-router-dom";

interface AnswerCardProps {
  answerObj: Answer;
  currentUserAvatar?: string; // passed only if the current user is the creator
  lastAnswerDivRef?: (node: any) => void;
  like: Like;
  unlike: Unlike;
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  answerObj,
  currentUserAvatar,
  lastAnswerDivRef,
  like,
  unlike,
}) => {
  const [creatorAvatar, setCreatorAvatar] = useState("");
  const {
    answer,
    isLiked,
    likes,
    id,
    createdBy: { userId, name, username },
  } = answerObj;

  const parseTextWithTags = (text: string) => {
    const parsedText = reactStringReplace(text, /@(\w+)/g, (tag, i) => (
      <span key={i} className="text-tag">
        @{tag}
      </span>
    ));
    return parsedText;
  };

  useEffect(() => {
    const getAvatar = async () =>
      setCreatorAvatar(await getUserAvatarUrlById(userId));

    // If the question is not created by current user get the users avatar
    if (!firebaseAuth.currentUser || firebaseAuth.currentUser.uid !== userId)
      getAvatar();
  }, [userId]);

  const history = useHistory();
  return (
    <div className="answer-card" ref={lastAnswerDivRef || null}>
      <div
        className="user-img"
        onClick={() => history.push(`/home/user/${username}`)}
      >
        <UserImageRounded src={currentUserAvatar || creatorAvatar} alt={name} />
      </div>
      <div className="answer-content">
        <h2 className="full-name">{name}</h2>
        <h4 className="username">@{username}</h4>
        <p className="text">{parseTextWithTags(answer)}</p>
        <div className="more-button">
          <div className="more-button-dot"></div>
          <div className="more-button-dot"></div>
          <div className="more-button-dot"></div>
        </div>
      </div>
      <div
        className={`likes${isLiked ? " liked" : ""}`}
        onClick={
          isLiked
            ? debounce(() => unlike({ type: "answer", refId: id }))
            : debounce(() => like({ type: "answer", refId: id }))
        }
      >
        <HeartIcon />
        <span className="likes-count">{formatNumbers(likes)}</span>
      </div>
    </div>
  );
};

export default AnswerCard;
