import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Action } from "redux";
import { RootState } from "../../../../../redux";
import { setIsPostQuestionOverlayHidden } from "../../../../../redux/postQuestionOverlay/postQuestionOverlayActions";
import TextareaAutosize from "react-textarea-autosize";
import {
  CheckmarkIcon,
  LockIcon,
  ShareIcon,
  UnlockedIcon,
} from "../../../../helperComponents/svgIcons";
import { shareLink } from "../../../../../helperFunctions/userActions";
import {
  checkIfPostQuestionIsAnswered,
  submitPostQuestionAnswer,
  togglePrivatePostQuestionAnswer,
} from "../../../../../redux/postQuestionAnswers/postQuestionAnswersActions";
import { ThunkDispatch } from "redux-thunk";
import {
  PostQuestion,
  PostQuestionAnswer,
  SubmitPostQuestionAnswer,
  SubmitPostQuestionAnswerData,
} from "../../../../../redux/postQuestionAnswers/postQuestionAnswersTypes";
import Spinner from "../../../../helperComponents/Spinner";
import { debounce } from "../../../../../helperFunctions";

interface PostViewQuestionOverlayProps {
  isHidden: boolean;
  postId: string;
  isRequestActive: boolean;
  questionId: string;
  isOwner: boolean;
  postQuestions: PostQuestion[];
  checkIfQuestionIsAnswered: (
    postId: string,
    questionId: string
  ) => Promise<PostQuestionAnswer | false>;
  setIsHidden: (isHidden: boolean) => void;
  submitAnswer: SubmitPostQuestionAnswer;
  togglePrivatePostQuestionAnswer: (
    questionId: string,
    answerId: string,
    isPrivate: boolean
  ) => Promise<boolean>;
}

const PostViewQuestionOverlay: React.FC<PostViewQuestionOverlayProps> = ({
  isHidden,
  postId,
  questionId,
  isRequestActive,
  isOwner,
  postQuestions,
  checkIfQuestionIsAnswered,
  togglePrivatePostQuestionAnswer,
  submitAnswer,
  setIsHidden,
}) => {
  const [isPrivateForForm, setIsPrivateForForm] = useState<boolean>(false);
  const [checkingIfAnswered, setCheckingIfAnswered] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [question, setQuestion] = useState<PostQuestion>({
    answers: [],
    hasMoreAnswers: true,
    lastAnswerDocRef: null,
    questionId: "",
    text: "",
    createdBy: { userId: "" },
  });

  const questionContainerRef = useRef<HTMLDivElement | null>(null);

  // get question from redux state and check if it's answered by the user if not already checked
  useEffect(() => {
    if (!questionId) return;
    const question = postQuestions.filter(
      (question) => question.questionId === questionId
    )[0];
    question && setQuestion(question);
    if (question.usersAnswer !== undefined) return;
    const checkIfAnswered = async () => {
      if (checkingIfAnswered) return;
      setCheckingIfAnswered(true);
      const answer = await checkIfQuestionIsAnswered(postId, questionId);
      setQuestion({ ...question, usersAnswer: answer ? answer : null });
      setCheckingIfAnswered(false);
    };

    checkIfAnswered();
  }, [
    questionId,
    checkIfQuestionIsAnswered,
    postId,
    postQuestions,
    question,
    checkingIfAnswered,
  ]);
  //
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!e.target) return;
      if (e.target === questionContainerRef.current) {
        setIsHidden(true);
        setAnswer("");
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [setIsHidden, checkingIfAnswered]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await submitAnswer({
      answerData: {
        isPrivate: isPrivateForForm,
        text: answer,
      },
      postId,
      questionId,
    });

    if (!success) return;
    setIsPrivateForForm(false);
  };

  return (
    <div
      className={`post-question-container${isHidden ? " hide" : ""}`}
      ref={questionContainerRef}
    >
      <div className="question">
        <p className="question-text">{question.text}</p>
        {checkingIfAnswered ? (
          <Spinner light />
        ) : !question.usersAnswer && !isOwner ? (
          <form className="form-control" id="answer-form" onSubmit={onSubmit}>
            <TextareaAutosize
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              name="answer"
              placeholder="Enter Answer Here"
            />
          </form>
        ) : (
          <p className="question-answer">
            {question.usersAnswer && question.usersAnswer.text}
          </p>
        )}
        <div className="divider">
          {!checkingIfAnswered && !question.usersAnswer && !isOwner && (
            <button
              className="btn btn-secondary-lighter"
              type="submit"
              form="answer-form"
              disabled={isRequestActive}
            >
              {isRequestActive ? <Spinner /> : <CheckmarkIcon />}
            </button>
          )}
        </div>
        <div
          className={`question-buttons${
            !isOwner ? (!question.usersAnswer ? " form-open" : "") : " owner"
          }`}
        >
          <Link to={`/post/${postId}/${questionId}`}>View All Comments</Link>
          <div
            className="icon share"
            onClick={() => shareLink({ addToUrl: `/${questionId}` })}
          >
            <ShareIcon />
          </div>
          {!isOwner && (
            <div
              className="icon lock"
              onClick={
                question.usersAnswer
                  ? debounce(() =>
                      togglePrivatePostQuestionAnswer(
                        questionId,
                        question.usersAnswer!.answerId,
                        question.usersAnswer!.isPrivate
                      )
                    )
                  : () => setIsPrivateForForm(!isPrivateForForm)
              }
            >
              {question.usersAnswer ? (
                question.usersAnswer.isPrivate ? (
                  <LockIcon />
                ) : (
                  <UnlockedIcon />
                )
              ) : isPrivateForForm ? (
                <LockIcon />
              ) : (
                <UnlockedIcon />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isHidden: state.postQuestionOverlay.isHidden,
  questionId: state.postQuestionOverlay.questionId,
  postQuestions: state.postQuestionAnswers.questions,
  isRequestActive: state.appState.isRequestActive,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  setIsHidden: (isHidden: boolean) =>
    dispatch(setIsPostQuestionOverlayHidden(isHidden)),
  submitAnswer: (postQuestionAnswerData: SubmitPostQuestionAnswerData) =>
    dispatch(submitPostQuestionAnswer(postQuestionAnswerData)),
  checkIfQuestionIsAnswered: (postId: string, questionId: string) =>
    dispatch(checkIfPostQuestionIsAnswered(postId, questionId)),
  togglePrivatePostQuestionAnswer: (
    questionId: string,
    answerId: string,
    isPrivate: boolean
  ) =>
    dispatch(togglePrivatePostQuestionAnswer(questionId, answerId, isPrivate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostViewQuestionOverlay);
