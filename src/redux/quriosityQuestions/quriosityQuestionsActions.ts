import { DocumentData } from "@google-cloud/firestore";
import { Dispatch } from "redux";
import { RootState } from "../rootReducer";
import { firebaseAuth, firestoreRef } from "../../firebase";
import { checkIfUserLiked } from "../helperReduxThunkActions";
import { Question } from "../questions/questionsTypes";
import {
  AddQuriosityQuestion,
  ChangeHasMoreQuriosityQuestions,
  HandleQuriosityQuestionLike,
  HandleQuriosityQuestionUnlike,
  LoadingQuriosityQuestions,
  PopulateQuriosityQuestions,
  SetLastQuriosityQuestionDocRef,
} from "./quriosityQuestionsTypes";
import { setNotification } from "../notifications/notificationActions";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import { getUserAvatarUrlById } from "../../helperFunctions/firebaseUserActions";
import { QuestionSchemaRes } from "../../responseSchemas";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";

export const populateQuriosityQuestions = (
  quriosityQuestions: Question[]
): PopulateQuriosityQuestions => ({
  type: "POPULATE_QURIOSITY_QUESTIONS",
  payload: quriosityQuestions,
});

export const addQuriosityQuestion = (
  question: Question
): AddQuriosityQuestion => ({
  type: "ADD_QURIOSITY_QUESTION",
  payload: question,
});

export const loadingQuriosityQuestions = (
  loading: boolean
): LoadingQuriosityQuestions => ({
  type: "LOADING_QURIOSITY_QUESTIONS",
  payload: loading,
});

export const handleQuriosityQuestionLike = (
  questionId: string
): HandleQuriosityQuestionLike => ({
  type: "HANDLE_QURIOSITY_QUESTION_LIKE",
  payload: questionId,
});

export const handleQuriosityQuestionUnlike = (
  questionId: string
): HandleQuriosityQuestionUnlike => ({
  type: "HANDLE_QURIOSITY_QUESTION_UNLIKE",
  payload: questionId,
});

export const setLastQuriosityQuestionDocRef = (
  currentDoc: DocumentData
): SetLastQuriosityQuestionDocRef => ({
  type: "SET_LAST_QURIOSITY_QUESTION_DOC_REF",
  payload: currentDoc,
});

export const changeHasMoreQuriosityQuestions = (
  hasMore: boolean
): ChangeHasMoreQuriosityQuestions => ({
  type: "CHANGE_HAS_MORE_QURIOSITY_QUESTIONS",
  payload: hasMore,
});

export const getQuriosityQuestions =
  () =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    // If there are no more questions to load
    if (!getState().quriosityQuestions.hasMore) return false;

    dispatch(loadingQuriosityQuestions(true));
    const quriosityQuestions: Question[] = [];
    const lastDoc = getState().quriosityQuestions.lastQuestionDocRef;
    const limit = 10;
    const questionsRef = firestoreRef.collection("questions");
    const currentUserId =
      firebaseAuth.currentUser && firebaseAuth.currentUser.uid;
    let numOfDoc = 0;

    try {
      const qs = lastDoc
        ? await questionsRef
            .orderBy("createdAt", "desc")
            .startAfter(lastDoc)
            .where("createdBy.userId", "==", currentUserId)
            .limit(limit)
            .get()
        : await questionsRef
            .orderBy("createdAt", "desc")
            .where("createdBy.userId", "==", currentUserId)
            .limit(limit)
            .get();
      if (!qs.empty) {
        for (const doc of qs.docs) {
          numOfDoc++;
          if (numOfDoc === qs.docs.length)
            dispatch(setLastQuriosityQuestionDocRef(doc));
          const question = doc.data() as QuestionSchemaRes;
          const questionId = doc.id;
          const isLiked = await checkIfUserLiked(questionId, "question");
          const questionProfileAvatar = await getUserAvatarUrlById(
            question.createdBy.userId
          );

          quriosityQuestions.push({
            ...question,
            isLiked,
            id: questionId,
            createdBy: {
              ...question.createdBy,
              profileAvatar: questionProfileAvatar,
            },
          });
        }
      } else {
        // If empty hasMore = false and send back a notification
        dispatch(
          setNotification({ text: getNotificationMessage("no-more-questions") })
        );
        dispatch(changeHasMoreQuriosityQuestions(false));
        dispatch(loadingQuriosityQuestions(false));
        return true;
      }
      quriosityQuestions.length > 0 &&
        dispatch(populateQuriosityQuestions(quriosityQuestions));
      if (quriosityQuestions.length < limit) {
        dispatch(
          setNotification({ text: getNotificationMessage("no-more-questions") })
        );
        dispatch(changeHasMoreQuriosityQuestions(false));
      }
      dispatch(loadingQuriosityQuestions(false));
      return true;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(loadingQuriosityQuestions(false));
      console.error(err);
      return false;
    }
  };
