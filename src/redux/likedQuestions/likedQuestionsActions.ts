import { Dispatch } from "redux";
import { firestoreRef } from "../../firebase";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";
import { getUserAvatarUrlById } from "../../helperFunctions/firebaseUserActions";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import { getLocalQuestionLikes } from "../../helperFunctions/localStorageActions";
import { QuestionSchemaRes } from "../../responseSchemas";
import { setNotification } from "../notifications/notificationActions";
import { Question } from "../questions/questionsTypes";
import { RootState } from "../rootReducer";
import {
  AddLikedQuestion,
  ChangeHasMoreLikedQuestions,
  HandleLikedQuestionLike,
  HandleLikedQuestionUnlike,
  LoadingLikedQuestions,
  PopulateLikedQuestions,
  SetLastLikedQuestionArrayRef,
} from "./likedQuestionsTypes";

export const populateLikedQuestions = (
  likedQuestions: Question[]
): PopulateLikedQuestions => ({
  type: "POPULATE_LIKED_QUESTIONS",
  payload: likedQuestions,
});

export const addLikedQuestion = (question: Question): AddLikedQuestion => ({
  type: "ADD_LIKED_QUESTION",
  payload: question,
});

export const loadingLikedQuestions = (
  loading: boolean
): LoadingLikedQuestions => ({
  type: "LOADING_LIKED_QUESTIONS",
  payload: loading,
});

export const handleLikedQuestionLike = (
  questionId: string
): HandleLikedQuestionLike => ({
  type: "HANDLE_LIKED_QUESTION_LIKE",
  payload: questionId,
});

export const handleLikedQuestionUnlike = (
  questionId: string
): HandleLikedQuestionUnlike => ({
  type: "HANDLE_LIKED_QUESTION_UNLIKE",
  payload: questionId,
});

export const setLastLikedQuestionRef = (
  lastQuestionId: string
): SetLastLikedQuestionArrayRef => ({
  type: "SET_LAST_LIKED_QUESTION_REF",
  payload: lastQuestionId,
});

export const changeHasMoreLikedQuestions = (
  hasMore: boolean
): ChangeHasMoreLikedQuestions => ({
  type: "CHANGE_HAS_MORE_LIKED_QUESTIONS",
  payload: hasMore,
});

export const getLikedQuestions =
  () =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    // If there are no more questions to load
    if (!getState().likedQuestions.hasMore) return false;

    dispatch(loadingLikedQuestions(true));
    const promises = [];
    const likedQuestions: Question[] = [];
    const likedQuestionIds = getLocalQuestionLikes();

    if (!likedQuestionIds) {
      dispatch(
        setNotification({ text: getNotificationMessage("no-liked-questions") })
      );
      dispatch(loadingLikedQuestions(false));
      return false;
    }

    const lastLikedQuestionRef = getState().likedQuestions.lastLikedQuestionRef;
    const lastArrayPosition = likedQuestionIds.indexOf(lastLikedQuestionRef);
    const limit = 10;
    const forLoopLimit =
      lastArrayPosition === -1
        ? likedQuestionIds.length - limit < 0
          ? 0
          : likedQuestionIds.length - limit
        : lastArrayPosition - limit < 0
        ? 0
        : lastArrayPosition - limit;
    let numOfDoc = 0;

    try {
      for (
        let i =
          lastArrayPosition !== -1
            ? lastArrayPosition - 1
            : likedQuestionIds.length - 1;
        i >= forLoopLimit;
        i--
      ) {
        numOfDoc++;
        if (numOfDoc === limit)
          dispatch(setLastLikedQuestionRef(likedQuestionIds[i]));
        const qs = firestoreRef.doc(`questions/${likedQuestionIds[i]}`).get();
        promises.push(qs);
      }
      const data = await Promise.all(promises);
      for (const questionDoc of data) {
        if (questionDoc.exists) {
          const questionData = questionDoc.data() as QuestionSchemaRes;

          const questionProfileAvatar = await getUserAvatarUrlById(
            questionData.createdBy.userId
          );
          const questionForState: Question = {
            ...questionData,
            id: questionDoc.id,
            isLiked: true,
            createdBy: {
              ...questionData.createdBy,
              profileAvatar: questionProfileAvatar,
            },
          };

          likedQuestions.push(questionForState);
        }
      }
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(loadingLikedQuestions(false));
      console.error(err);
      return false;
    }

    if (likedQuestions.length > 0)
      dispatch(populateLikedQuestions(likedQuestions));
    if (likedQuestions.length < limit) {
      dispatch(
        setNotification({ text: getNotificationMessage("no-more-questions") })
      );
      dispatch(changeHasMoreLikedQuestions(false));
    }
    dispatch(loadingLikedQuestions(false));
    return true;
  };
