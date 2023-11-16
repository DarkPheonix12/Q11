import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useObserveIntersection } from "../../../../helperFunctions/customHooks";
import {
  Answer,
  getUserImpactsAndQuestions,
  Like,
  Question,
  RootState,
  Unlike,
} from "../../../../redux";
import {
  LikeData,
  like,
  unlike,
} from "../../../../redux/helperReduxThunkActions";
import Spinner from "../../../helperComponents/Spinner";
import AddQuestionButton from "./AddQuestionButton";
import DiscussEmpty from "./DiscussEmpty";
import QABox from "./QABox";

interface ImpactsProps {
  questions: Question[];
  answers: Answer[];
  getUserImpactsAndQuestions: () => any;
  like: Like;
  unlike: Unlike;
  loading: boolean;
  appLoading: boolean;
}

const Impacts: React.FC<ImpactsProps> = ({
  questions,
  answers,
  loading,
  appLoading,
  getUserImpactsAndQuestions,
  like,
  unlike,
}) => {
  useEffect(() => {
    const getQ = async () => await getUserImpactsAndQuestions();
    !appLoading && answers.length < 1 && getQ();
  }, [getUserImpactsAndQuestions, appLoading, answers.length]);

  const [lastAnswerDivRef] = useObserveIntersection(getUserImpactsAndQuestions);

  return (
    <section className={`impacts${answers.length < 1 ? " empty" : ""}`}>
      {answers.length < 1 ? (
        !appLoading && !loading ? (
          <DiscussEmpty />
        ) : null
      ) : (
        <section className="answers">
          {answers.map((answer, i) =>
            answers.length === i + 1 ? (
              <QABox
                lastQuestionDivRef={lastAnswerDivRef}
                answer={answer}
                questionObj={
                  questions.filter((q) => q.id === answer.questionId)[0]
                }
                userImg
                page="impacts"
                key={i}
                like={like}
                unlike={unlike}
              />
            ) : (
              <QABox
                answer={answer}
                questionObj={
                  questions.filter((q) => q.id === answer.questionId)[0]
                }
                userImg
                page="impacts"
                key={i}
                like={like}
                unlike={unlike}
              />
            )
          )}
          <AddQuestionButton />
          {loading && <Spinner />}
        </section>
      )}
      {answers.length < 1 && (loading || appLoading) && <Spinner />}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  questions: state.userImpacts.questions,
  answers: state.userImpacts.answers,
  loading: state.userImpacts.loading,
  appLoading: state.appState.loading,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getUserImpactsAndQuestions: () => dispatch(getUserImpactsAndQuestions()),
  like: (likeData: LikeData) => dispatch(like(likeData)),
  unlike: (unlikeData: LikeData) => dispatch(unlike(unlikeData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Impacts);
