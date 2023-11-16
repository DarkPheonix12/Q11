import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import { debounce, formatNumbers } from "../../../../helperFunctions";
import { Answer } from "../../../../redux";
import {
  Like,
  Question,
  Unlike,
} from "../../../../redux/questions/questionsTypes";
import { HeartIcon } from "../../../helperComponents/svgIcons";
import UserImageRounded from "../../../helperComponents/UserImageRounded";

interface QABoxProps {
  questionObj: Question;
  answer?: Answer;
  userImg: boolean;
  page: "all" | "impacts" | "quriosity" | "saved";
  lastQuestionDivRef?: (node: any) => void;
  like: Like;
  unlike: Unlike;
}

const QABox: React.FC<QABoxProps> = React.memo(
  ({
    questionObj,
    answer,
    userImg,
    page,
    lastQuestionDivRef,
    like,
    unlike,
  }) => {
    const {
      likes,
      question,
      id,
      hashtags,
      isLiked,
      createdBy: { profileAvatar, username, name },
    } = questionObj;

    const likeIcon = useRef<HTMLDivElement>(null);
    const userImgRounded = useRef<HTMLImageElement>(null);
    const history = useHistory();

    const handleQuestionClick = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (e.target === userImgRounded.current) {
        history.push(`/home/user/${username}`);
      } else if (e.target !== likeIcon.current) {
        history.push(`/home/discuss/question/${id}`);
      }
    };
    return (
      <div
        ref={lastQuestionDivRef || null}
        className="qa-box box-card"
        onClick={handleQuestionClick}
      >
        {userImg && (
          <div className="user-img">
            <UserImageRounded
              reference={userImgRounded}
              src={profileAvatar}
              alt={name}
              className="qa-user-avatar"
            />
          </div>
        )}

        {!answer ? (
          <div className="qa-content">
            <p className="qa-text">{question}</p>
            <p className="qa-hashtags">
              {hashtags.map((hashtag, i) => {
                return (
                  <span className="qa-hashtag" key={i}>
                    {hashtag}{" "}
                  </span>
                );
              })}
            </p>
            <div className="likes">
              <div
                className={`icon${isLiked ? " liked" : ""} `}
                ref={likeIcon}
                onClick={
                  isLiked
                    ? debounce(() => unlike({ type: "question", refId: id }))
                    : debounce(() => like({ type: "question", refId: id }))
                }
              >
                <HeartIcon />
              </div>
              <span className="likes-count">{formatNumbers(likes)}</span>
            </div>
          </div>
        ) : (
          <div className="qa-content">
            <h2 className="qa-question">{question}</h2>
            {answer.answer && <p className="qa-text">{answer.answer}</p>}
            <p className="qa-hashtags">
              {hashtags.map((hashtag, i) => {
                return (
                  <span className="qa-hashtag" key={i}>
                    {hashtag}{" "}
                  </span>
                );
              })}
            </p>
            <div className="likes">
              <div
                className={`icon${answer.isLiked ? " liked" : ""} `}
                ref={likeIcon}
                onClick={
                  !answer
                    ? isLiked
                      ? debounce(() => unlike({ type: "question", refId: id }))
                      : debounce(() => like({ type: "question", refId: id }))
                    : answer.isLiked
                    ? debounce(() =>
                        unlike({ type: "answer", refId: answer.id })
                      )
                    : debounce(() => like({ type: "answer", refId: answer.id }))
                }
              >
                <HeartIcon />
              </div>
              <span className="likes-count">{formatNumbers(answer.likes)}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default QABox;
