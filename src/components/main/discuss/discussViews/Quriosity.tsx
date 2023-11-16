import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useObserveIntersection } from "../../../../helperFunctions/customHooks";
import {
  RootState,
  getQuriosityQuestions,
  Question,
  Like,
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

interface QuriosityProps {
  quriosityQuestions: Question[];
  loading: boolean;
  appLoading: boolean;
  getQuriosityQuestions: () => Promise<boolean>;
  like: Like;
  unlike: Unlike;
}

const Quriosity: React.FC<QuriosityProps> = ({
  loading,
  quriosityQuestions,
  appLoading,
  getQuriosityQuestions,
  like,
  unlike,
}) => {
  useEffect(() => {
    const getQ = async () => await getQuriosityQuestions();
    !appLoading && quriosityQuestions.length < 1 && getQ();
  }, [getQuriosityQuestions, appLoading, quriosityQuestions.length]);

  const [lastQuestionDivRef] = useObserveIntersection(getQuriosityQuestions);
  return (
    <section
      className={`quriosity${quriosityQuestions.length < 1 ? " empty" : ""}`}
    >
      {quriosityQuestions.length < 1 ? (
        !appLoading && !loading ? (
          <DiscussEmpty />
        ) : null
      ) : (
        <section className="questions">
          {quriosityQuestions.map((question, i) =>
            quriosityQuestions.length === i + 1 ? (
              <QABox
                lastQuestionDivRef={lastQuestionDivRef}
                questionObj={question}
                userImg={false}
                page="quriosity"
                key={i}
                like={like}
                unlike={unlike}
              />
            ) : (
              <QABox
                questionObj={question}
                userImg={false}
                page="quriosity"
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
      {quriosityQuestions.length < 1 && (loading || appLoading) && <Spinner />}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  quriosityQuestions: state.quriosityQuestions.questions,
  loading: state.quriosityQuestions.loading,
  appLoading: state.appState.loading,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getQuriosityQuestions: () => dispatch(getQuriosityQuestions()),
  like: (likeData: LikeData) => dispatch(like(likeData)),
  unlike: (unlikeData: LikeData) => dispatch(unlike(unlikeData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Quriosity);
