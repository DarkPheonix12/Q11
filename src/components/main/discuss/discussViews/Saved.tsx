import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useObserveIntersection } from "../../../../helperFunctions/customHooks";
import {
  getLikedQuestions,
  Like,
  Question,
  RootState,
  Unlike,
} from "../../../../redux";
import {
  like,
  LikeData,
  unlike,
} from "../../../../redux/helperReduxThunkActions";
import Spinner from "../../../helperComponents/Spinner";
import AddQuestionButton from "./AddQuestionButton";
import DiscussEmpty from "./DiscussEmpty";
import QABox from "./QABox";

interface SavedProps {
  likedQuestions: Question[];
  loading: boolean;
  appLoading: boolean;
  getLikedQuestions: () => any;
  like: Like;
  unlike: Unlike;
}

const Saved: React.FC<SavedProps> = ({
  likedQuestions,
  loading,
  appLoading,
  like,
  unlike,
  getLikedQuestions,
}) => {
  useEffect(() => {
    !appLoading && likedQuestions.length === 0 && getLikedQuestions();
  }, [getLikedQuestions, appLoading, likedQuestions.length]);

  const [lastQuestionDivRef] = useObserveIntersection(getLikedQuestions);
  return (
    <section className={`saved${likedQuestions.length < 1 ? " empty" : ""}`}>
      {likedQuestions.length < 1 ? (
        !appLoading && !loading ? (
          <DiscussEmpty />
        ) : null
      ) : (
        <section className="questions">
          {likedQuestions.map((question, i) =>
            likedQuestions.length === i + 1 ? (
              <QABox
                lastQuestionDivRef={lastQuestionDivRef}
                questionObj={question}
                userImg
                page="saved"
                key={i}
                like={like}
                unlike={unlike}
              />
            ) : (
              <QABox
                questionObj={question}
                userImg
                page="saved"
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
      {likedQuestions.length < 1 && (loading || appLoading) && <Spinner />}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  likedQuestions: state.likedQuestions.questions,
  loading: state.likedQuestions.loading,
  appLoading: state.appState.loading,
  currentUserAvatar: state.user.profileAvatar,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getLikedQuestions: () => dispatch(getLikedQuestions()),
  like: (likeData: LikeData) => dispatch(like(likeData)),
  unlike: (unlikeData: LikeData) => dispatch(unlike(unlikeData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Saved);
