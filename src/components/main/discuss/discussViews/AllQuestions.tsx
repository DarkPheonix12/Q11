import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  RootState,
  getQuestions,
  // testPopulatePosts,
  // testPopulateQuestions,
  // testPopulateUsers,
  // testPopulateFollowers,
} from "../../../../redux";
import {
  Like,
  Question,
  Unlike,
} from "../../../../redux/questions/questionsTypes";
import AddQuestionButton from "./AddQuestionButton";
import DiscussEmpty from "./DiscussEmpty";
import QABox from "./QABox";
import { useObserveIntersection } from "../../../../helperFunctions/customHooks";
import Spinner from "../../../helperComponents/Spinner";
import {
  LikeData,
  like,
  unlike,
} from "../../../../redux/helperReduxThunkActions";

interface AllQuestionsProps {
  questions: Question[];
  loading: boolean;
  appLoading: boolean;
  currentUserAvatar: string;
  getQuestions: () => Promise<boolean>;
  // testPopulateQuestions: any;
  // testPopulatePosts: any;
  like: Like;
  unlike: Unlike;
}

const AllQuestions: React.FC<AllQuestionsProps> = ({
  questions,
  getQuestions,
  loading,
  appLoading,
  like,
  unlike,
  // testPopulateQuestions,
  // testPopulatePosts,
}) => {
  // useEffect(() => {
  //   const test = async () => {
  //     await testPopulateUsers();
  //     for (let i = 0; i < 7; i++) await testPopulateQuestions();
  //     for (let i = 0; i < 7; i++) await testPopulatePosts();
  //     await testPopulateFollowers();
  //   };

  //   // test();
  // }, []);

  useEffect(() => {
    const getQ = async () => await getQuestions();
    if (questions.length < 1) getQ();
  }, [getQuestions, questions.length]);

  const [lastQuestionDivRef] = useObserveIntersection(getQuestions);
  return (
    <section className={`all-questions${questions.length < 1 ? " empty" : ""}`}>
      {questions.length < 1 ? (
        !appLoading && !loading ? (
          <DiscussEmpty />
        ) : null
      ) : (
        <section className="questions">
          {questions.map((question, i) => (
            <QABox
              lastQuestionDivRef={
                questions.length === i + 1 ? lastQuestionDivRef : undefined
              }
              questionObj={question}
              userImg
              page="all"
              key={i}
              like={like}
              unlike={unlike}
            />
          ))}
          <AddQuestionButton />
          {loading && <Spinner />}
        </section>
      )}
      {questions.length < 1 && loading && <Spinner />}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  questions: state.questions.questions,
  loading: state.questions.loading,
  appLoading: state.appState.loading,
  currentUserAvatar: state.user.profileAvatar,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getQuestions: () => dispatch(getQuestions()),
  like: (likeData: LikeData) => dispatch(like(likeData)),
  unlike: (unlikeData: LikeData) => dispatch(unlike(unlikeData)),
  // testPopulateQuestions: () => dispatch(testPopulateQuestions()),
  // testPopulatePosts: () => dispatch(testPopulatePosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AllQuestions);
