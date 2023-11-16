import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CheckmarkIcon,
  LockIcon,
  ShareIcon,
  UnlockedIcon,
} from "../../../../../helperComponents/svgIcons";
import TextareaAutosize from "react-textarea-autosize";
import PostViewQuestionAllAnswersHeader from "./PostViewQuestionAllAnswersHeader";
import PostViewQuestionAnswer from "./PostViewQuestionAnswer";
import { connect } from "react-redux";
import { Like, RootState, Unlike } from "../../../../../../redux";
import {
  PostQuestion,
  PostQuestionAnswer,
  SubmitPostQuestionAnswer,
  SubmitPostQuestionAnswerData,
} from "../../../../../../redux/postQuestionAnswers/postQuestionAnswersTypes";
import {
  checkIfPostQuestionIsAnswered,
  getPostQuestion,
  getPostQuestionAnswers,
  submitPostQuestionAnswer,
  // testPopulateAnswers,
  togglePrivatePostQuestionAnswer,
} from "../../../../../../redux/postQuestionAnswers/postQuestionAnswersActions";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import Spinner from "../../../../../helperComponents/Spinner";
import { shareLink } from "../../../../../../helperFunctions/userActions";
import { debounce } from "../../../../../../helperFunctions";
import { useObserveIntersection } from "../../../../../../helperFunctions/customHooks";
import {
  LikeData,
  like,
  unlike,
} from "../../../../../../redux/helperReduxThunkActions";
import { firebaseAuth } from "../../../../../../firebase";

interface PostViewQuestionAllAnswersProps {
  postQuestions: PostQuestion[];
  isLoadingQuestion: boolean;
  isLoadingAnswers: boolean;
  getPostQuestionAnswers: (
    postId: string,
    questionId: string
  ) => Promise<PostQuestionAnswer[] | false>;
  getPostQuestion: (
    postId: string,
    questionId: string
  ) => Promise<PostQuestion | false>;
  checkIfQuestionIsAnswered: (
    postId: string,
    questionId: string
  ) => Promise<PostQuestionAnswer | false>;
  togglePrivatePostQuestionAnswer: (
    questionId: string,
    answerId: string,
    isPrivate: boolean
  ) => Promise<boolean>;
  submitAnswer: SubmitPostQuestionAnswer;
  like: Like;
  unlike: Unlike;
}

const PostViewQuestionAllAnswers: React.FC<PostViewQuestionAllAnswersProps> = ({
  postQuestions,
  isLoadingQuestion,
  isLoadingAnswers,
  getPostQuestionAnswers,
  getPostQuestion,
  checkIfQuestionIsAnswered,
  togglePrivatePostQuestionAnswer,
  submitAnswer,
  like,
  unlike,
}) => {
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(true);
  const [formAnswer, setFormAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<PostQuestionAnswer[]>([]);
  const [question, setQuestion] = useState<PostQuestion>({
    answers: [],
    hasMoreAnswers: true,
    lastAnswerDocRef: null,
    questionId: "",
    text: "",
    createdBy: { userId: "" },
  });
  const [checkingIfAnswered, setCheckingIfAnswered] = useState<boolean>(true);
  const params = useParams<{ postId: string; questionId: string }>();
  const { postId, questionId } = params;

  const [lastAnswerDocRef] = useObserveIntersection(getPostQuestionAnswers, [
    postId,
    questionId,
  ]);

  // useEffect(() => {
  //   // testPopulateAnswers(postId, questionId);
  // }, []);

  useEffect(() => {
    const getQandA = async () => {
      const question = await getPostQuestion(postId, questionId);
      if (!question) return;
      setQuestion(question);

      if (question.usersAnswer === undefined) {
        const answer = await checkIfQuestionIsAnswered(postId, questionId);
        setQuestion({ ...question, usersAnswer: answer ? answer : null });
        setCheckingIfAnswered(false);
      }
      setCheckingIfAnswered(false);

      if (question.answers.length > 0) {
        setAnswers(question.answers);
        return;
      }

      const answers = await getPostQuestionAnswers(postId, questionId);
      if (!answers) return;
      setAnswers(answers);
    };

    getQandA();
  }, [
    postQuestions,
    checkIfQuestionIsAnswered,
    getPostQuestion,
    getPostQuestionAnswers,
    postId,
    questionId,
  ]);

  useEffect(() => {
    const user = firebaseAuth.currentUser;
    if (!user) return;
    if (user.uid === question.createdBy.userId) setIsOwner(true);
    else setIsOwner(false);
  }, [question.createdBy.userId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await submitAnswer({
      answerData: {
        isPrivate,
        text: formAnswer,
      },
      postId,
      questionId,
    });

    if (!success) return;
    setIsPrivate(false);
  };

  return (
    <div className="question-answers-container">
      <PostViewQuestionAllAnswersHeader />
      <div className="question-answers">
        <div className="question">
          {isLoadingQuestion ? <Spinner light /> : question.text}
        </div>
        <div className="divider">
          {!checkingIfAnswered && !question.usersAnswer && !isOwner && (
            <button
              className="btn btn-secondary-lighter"
              form="answer-form"
              type="submit"
            >
              <CheckmarkIcon />
            </button>
          )}
        </div>
        {checkingIfAnswered ? (
          !isLoadingQuestion ? (
            <Spinner light />
          ) : null
        ) : !question.usersAnswer ? (
          !isOwner && (
            <form className="form-control" id="answer-form" onSubmit={onSubmit}>
              <TextareaAutosize
                className="input-control"
                placeholder="Enter Answer Here"
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
              />
            </form>
          )
        ) : (
          <PostViewQuestionAnswer
            key={question.usersAnswer!.answerId}
            answer={question.usersAnswer!}
            like={like}
            unlike={unlike}
            isUserAnswer
          />
        )}
        {!checkingIfAnswered && !isOwner && (
          <div
            className={`question-buttons${
              !question.usersAnswer ? " form-open" : ""
            }`}
          >
            <div
              className="icon"
              onClick={() => shareLink({ addToUrl: `/${questionId}` })}
            >
              <ShareIcon />
            </div>
            <div
              className="icon"
              onClick={
                question.usersAnswer
                  ? debounce(() =>
                      togglePrivatePostQuestionAnswer(
                        questionId,
                        question.usersAnswer!.answerId,
                        question.usersAnswer!.isPrivate
                      )
                    )
                  : () => setIsPrivate(!isPrivate)
              }
            >
              {!question.usersAnswer &&
                (isPrivate ? <LockIcon /> : <UnlockedIcon />)}

              {question.usersAnswer &&
                (question.usersAnswer.isPrivate ? (
                  <LockIcon />
                ) : (
                  <UnlockedIcon />
                ))}
            </div>
          </div>
        )}
        <div className="answers">
          {answers.length > 0
            ? answers.map((answer, i) =>
                answers.length === i + 1 ? (
                  <PostViewQuestionAnswer
                    lastAnswerDocRef={lastAnswerDocRef}
                    key={answer.answerId}
                    answer={answer}
                    like={like}
                    unlike={unlike}
                  />
                ) : (
                  <PostViewQuestionAnswer
                    key={answer.answerId}
                    answer={answer}
                    like={like}
                    unlike={unlike}
                  />
                )
              )
            : null}
          {isLoadingAnswers && <Spinner light />}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  postQuestions: state.postQuestionAnswers.questions,
  isLoadingQuestion: state.postQuestionAnswers.isLoadingQuestion,
  isLoadingAnswers: state.postQuestionAnswers.isLoadingAnswers,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getPostQuestionAnswers: (postId: string, questionId: string) =>
    dispatch(getPostQuestionAnswers(postId, questionId)),
  getPostQuestion: (postId: string, questionId: string) =>
    dispatch(getPostQuestion(postId, questionId)),
  checkIfQuestionIsAnswered: (postId: string, questionId: string) =>
    dispatch(checkIfPostQuestionIsAnswered(postId, questionId)),
  submitAnswer: (postQuestionAnswerData: SubmitPostQuestionAnswerData) =>
    dispatch(submitPostQuestionAnswer(postQuestionAnswerData)),
  togglePrivatePostQuestionAnswer: (
    questionId: string,
    answerId: string,
    isPrivate: boolean
  ) =>
    dispatch(togglePrivatePostQuestionAnswer(questionId, answerId, isPrivate)),
  like: (likeData: LikeData) => dispatch(like(likeData)),
  unlike: (unlikeData: LikeData) => dispatch(unlike(unlikeData)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostViewQuestionAllAnswers);
