import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useObserveIntersection } from "../../../../../helperFunctions/customHooks";
import { getNotificationMessage } from "../../../../../helperFunctions/customNotificationMessages";
import { checkIfCreatorIsCurrentUser } from "../../../../../helperFunctions/firebaseUserActions";
import { shareLink } from "../../../../../helperFunctions/userActions";
import {
  Answer,
  followUser,
  getQuestion,
  Like,
  Question as QuestionReduxState,
  RootState,
  setNotification,
  Notification,
  shareQuestion,
  StatusOfAnswers,
  submitAnswer,
  Unlike,
} from "../../../../../redux";
import { getAnswers /*, testPopulateAnswers */ } from "../../../../../redux";
import {
  like,
  LikeData,
  unlike,
} from "../../../../../redux/helperReduxThunkActions";
import Spinner from "../../../../helperComponents/Spinner";
import UserImageRounded from "../../../../helperComponents/UserImageRounded";
import AnswerCard from "./AnswerCard";
import QuestionHeader from "./QuestionHeader";

interface QuestionProps {
  answers: Answer[];
  statusOfAnswers: StatusOfAnswers[];
  loadingQuestion: boolean;
  loadingAnswers: boolean;
  profileAvatar: string;
  username: string;
  userFollowing: string[];
  loggedIn: boolean;
  isRequestActive: boolean;
  getQuestion: (questionId: string) => any;
  // testPopulateAnswers: (questionId: string) => any;
  getAnswers: (questionId: string) => any;
  like: Like;
  unlike: Unlike;
  setNotification: typeof setNotification;
  submitAnswer: (answerData: {
    text: string;
    questionObj: QuestionReduxState;
  }) => Promise<boolean>;
  followUser: (followedUserId: string) => Promise<boolean>;
  shareQuestion: (questionId: string) => Promise<boolean>;
}

const Question: React.FC<QuestionProps> = ({
  loadingQuestion,
  loadingAnswers,
  loggedIn,
  isRequestActive,
  getQuestion,
  answers,
  getAnswers,
  like,
  unlike,
  setNotification,
  profileAvatar,
  username,
  submitAnswer,
  followUser,
  statusOfAnswers,
  userFollowing,
  shareQuestion,
  // testPopulateAnswers,
}) => {
  const [charCount, updateCharCount] = useState(0);
  const [textareaValue, updateTextAreaValue] = useState("");
  const [userHasAnswered, updateUserHasAnswered] = useState(true);
  const [shared, changeShared] = useState(false);
  const [currentQuestion, updateCurrentQuestion] = useState<QuestionReduxState>(
    {
      question: "",
      hashtags: [],
      likes: 0,
      isLiked: true,
      createdBy: {
        name: "",
        username: "",
        profileAvatar: "",
        userId: "",
      },
      createdAt: 0,
      id: "",
      numberOfShares: 0,
    }
  );

  const questionId = useParams<{ questionId: string }>().questionId;
  const history = useHistory();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    updateTextAreaValue(e.target.value);
    updateCharCount(e.target.value.length);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textAreaForUpload = textareaValue.trim();
    if (textAreaForUpload.length > 0) {
      if (!isRequestActive) {
        await submitAnswer({
          text: textareaValue,
          questionObj: currentQuestion,
        });
      }
    } else {
      updateTextAreaValue("");
      setNotification({ text: getNotificationMessage("answer-empty") });
    }
  };

  const handleLike = async () => {
    loggedIn &&
      updateCurrentQuestion({
        ...currentQuestion,
        likes: currentQuestion.likes + 1,
        isLiked: true,
      });
    await like({ type: "question", refId: questionId });
  };
  const handleUnlike = async () => {
    loggedIn &&
      updateCurrentQuestion({
        ...currentQuestion,
        likes: currentQuestion.likes - 1,
        isLiked: false,
      });
    await unlike({ type: "question", refId: questionId });
  };

  const handleShare = async () => {
    shareLink();
    if (!shared) {
      changeShared(true);
      const isShared = await shareQuestion(questionId);
      !isShared && changeShared(false);
    }
  };

  const handleFollow = async () => {
    const isFollowed = await followUser(currentQuestion.createdBy.userId);
    isFollowed &&
      setNotification({
        text: getNotificationMessage("follow-success"),
      });
  };

  // useEffect(() => {
  //   testPopulateAnswers(questionId);
  // }, []);

  // Filter all the answers from state to get only answers for current question
  useEffect(() => {
    const questionAnswers = answers.filter(
      (answer) => answer.questionId === questionId
    );
    if (questionAnswers.length === 0) getAnswers(questionId);
  }, [getAnswers, questionId, answers]);

  // Gets the question by questionId - gets it from state if available
  useEffect(() => {
    let currentQuestion: QuestionReduxState;
    const populateQuestion = async () => {
      currentQuestion = await getQuestion(questionId);
      if (currentQuestion.question) {
        updateCurrentQuestion(currentQuestion);
        window.scrollTo(0, 0);
      } else {
        setTimeout(() => history.push("/home/discuss/all"), 2000);
      }
    };
    populateQuestion();
  }, [getQuestion, history, questionId]);

  // Checking if the user has answered this question
  useEffect(() => {
    const status = statusOfAnswers.filter(
      (status) => status.questionId === questionId
    )[0];
    let hasAnswered: boolean;
    if (status !== undefined) hasAnswered = status.hasAnswered;
    else hasAnswered = true;
    updateUserHasAnswered(hasAnswered);
  }, [statusOfAnswers, questionId]);

  const [lastAnswerDivRef] = useObserveIntersection(getAnswers, [questionId]);
  return (
    <section
      className={`question${currentQuestion.question === "" ? " empty" : ""}`}
    >
      {loadingQuestion ? (
        <Spinner />
      ) : currentQuestion.question !== "" ? (
        <>
          <QuestionHeader
            questionData={currentQuestion}
            userFollowing={userFollowing}
            currentUserUsername={username}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleShare={handleShare}
            handleFollow={handleFollow}
          />
          {!userHasAnswered && currentQuestion.createdBy.username !== username && (
            <section className="answer-card answer-form">
              <UserImageRounded
                src={profileAvatar}
                alt={currentQuestion.createdBy.name}
              />
              <form className="" onSubmit={(e) => onSubmit(e)}>
                <textarea
                  name="answer"
                  className="qa-textarea"
                  placeholder="Type something..."
                  maxLength={160}
                  onChange={(e) => onChange(e)}
                ></textarea>
                <div className="char-counter">{charCount}/160</div>
                <button
                  className="btn btn-secondary add-answer-button"
                  disabled={isRequestActive}
                >
                  {isRequestActive && <Spinner />}
                </button>
              </form>
            </section>
          )}

          <section className="answers">
            {answers.map((answer, i) => {
              if (answer.questionId === questionId) {
                return (
                  <AnswerCard
                    answerObj={answer}
                    key={i}
                    lastAnswerDivRef={
                      answers.length === i + 1 ? lastAnswerDivRef : undefined
                    }
                    currentUserAvatar={
                      checkIfCreatorIsCurrentUser(answer.createdBy.userId)
                        ? profileAvatar
                        : undefined
                    }
                    like={like}
                    unlike={unlike}
                  />
                );
              } else return null;
            })}
            {loadingAnswers && <Spinner />}
          </section>
        </>
      ) : (
        <h1 className="not-found">Question not found. Redirecting...</h1>
      )}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  loadingQuestion: state.questions.loading,
  loadingAnswers: state.answers.loading,
  statusOfAnswers: state.answers.statusOfAnswers,
  answers: state.answers.answers,
  loggedIn: state.user.loggedIn,
  username: state.user.username,
  profileAvatar: state.user.profileAvatar,
  userFollowing: state.userActivity.following,
  isRequestActive: state.appState.isRequestActive,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getQuestion: (questionId: string) => dispatch(getQuestion(questionId)),
  getAnswers: (questionId: string) => dispatch(getAnswers(questionId)),
  like: (likeData: LikeData) => dispatch(like(likeData)),
  unlike: (unlikeData: LikeData) => dispatch(unlike(unlikeData)),
  submitAnswer: (answerData: {
    text: string;
    questionObj: QuestionReduxState;
  }) => dispatch(submitAnswer(answerData)),
  setNotification: (notification: Notification) =>
    dispatch(setNotification(notification)),
  followUser: (followedUserId: string) => dispatch(followUser(followedUserId)),
  shareQuestion: (questionId: string) => dispatch(shareQuestion(questionId)),

  // testPopulateAnswers: (questionId: string) =>
  //   dispatch(testPopulateAnswers(questionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
