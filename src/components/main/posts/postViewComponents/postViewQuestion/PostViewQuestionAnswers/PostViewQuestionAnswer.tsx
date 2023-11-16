import React from "react";
import { Link } from "react-router-dom";
import { debounce } from "../../../../../../helperFunctions";
import { Like, Unlike } from "../../../../../../redux";
import { PostQuestionAnswer } from "../../../../../../redux/postQuestionAnswers/postQuestionAnswersTypes";
import { HeartIcon } from "../../../../../helperComponents/svgIcons";

interface PostViewQuestionAnswerProps {
  answer: PostQuestionAnswer;
  isUserAnswer?: boolean;
  lastAnswerDocRef?: (node: HTMLDivElement) => void;
  like: Like;
  unlike: Unlike;
}

const PostViewQuestionAnswer: React.FC<PostViewQuestionAnswerProps> = ({
  answer,
  isUserAnswer,
  lastAnswerDocRef,
  like,
  unlike,
}) => {
  const {
    answerId,
    questionId,
    text,
    likes,
    isLiked,
    createdBy: { userFullName, username },
  } = answer;
  return (
    <div
      className={`question-answer${isUserAnswer ? " user-answer" : ""}`}
      ref={lastAnswerDocRef || null}
    >
      <div className="question-answer-content">
        <div className="text">{text}</div>
        <div className={`likes${isLiked ? " liked" : ""}`}>
          <div
            className="icon"
            onClick={
              isLiked
                ? debounce(() =>
                    unlike({
                      type: "postQuestionAnswer",
                      refId: answerId,
                      postQuestionId: questionId,
                    })
                  )
                : debounce(() =>
                    like({
                      type: "postQuestionAnswer",
                      refId: answerId,
                      postQuestionId: questionId,
                    })
                  )
            }
          >
            <HeartIcon />
          </div>
          <p className="likes-number">{likes}</p>
        </div>
      </div>
      <Link to={`/home/user/${username}`} className="question-answer-fullname">
        - {userFullName}
      </Link>
    </div>
  );
};

export default PostViewQuestionAnswer;
