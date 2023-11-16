import { Dispatch } from "redux";
import { setNotification } from "..";
import firebase, { firebaseAuth, firestoreRef } from "../../firebase";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import {
  QuestionSchema,
  RecentActivitySchema,
  UserSchema,
} from "../../schemas";
import { RootState } from "../rootReducer";
import {
  Question,
  PopulateQuestions,
  AddQuestion,
  LoadingQuestions,
  SetLastQuestionDocRef,
  ChangeHasMoreQuestions,
  HandleQuestionLike,
  HandleQuestionUnlike,
  IncrementQuestionShares,
} from "./questionsTypes";

import { DocumentData } from "@google-cloud/firestore";
import { checkIfUserLiked } from "../helperReduxThunkActions";
import { addQuriosityQuestion } from "../quriosityQuestions/quriosityQuestionsActions";
import { addRecentActivity } from "../user/userActions";
import { getUserAvatarUrlById } from "../../helperFunctions/firebaseUserActions";
import { QuestionSchemaRes } from "../../responseSchemas";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";
import { setRequestActive } from "../appState/appStateActions";

export const populateQuestions = (payload: Question[]): PopulateQuestions => ({
  type: "POPULATE_QUESTIONS",
  payload,
});

export const addQuestion = (payload: Question): AddQuestion => ({
  type: "ADD_QUESTION",
  payload,
});

export const loadingQuestions = (payload: boolean): LoadingQuestions => ({
  type: "LOADING_QUESTIONS",
  payload,
});

export const setLastQuestionDocRef = (
  payload: DocumentData
): SetLastQuestionDocRef => ({
  type: "SET_LAST_QUESTION_DOC_REF",
  payload,
});

export const changeHasMoreQuestions = (
  payload: boolean
): ChangeHasMoreQuestions => ({
  type: "CHANGE_HAS_MORE_QUESTIONS",
  payload,
});

export const handleQuestionLike = (payload: string): HandleQuestionLike => ({
  type: "HANDLE_QUESTION_LIKE",
  payload,
});

export const handleQuestionUnlike = (
  payload: string
): HandleQuestionUnlike => ({
  type: "HANDLE_QUESTION_UNLIKE",
  payload,
});

export const incrementQuestionShares = (
  payload: string
): IncrementQuestionShares => ({
  type: "INCREMENT_QUESTION_SHARES",
  payload,
});

export const getQuestions =
  () =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    // If there are no more questions to load
    if (!getState().questions.hasMore) return false;

    dispatch(loadingQuestions(true));
    // Start loading questions
    const questionsArray: Question[] = [];
    const questionsRef = firestoreRef.collection("questions");
    // Getting Questions From Firebase - If lastDoc is present getting documents after it
    try {
      const lastDoc = getState().questions.lastQuestionDocRef;
      let limit = 10;
      let numOfDoc = 0;

      const qs = lastDoc // Query Snapshot depends on if lastDocRef is present
        ? await questionsRef
            .orderBy("createdAt", "desc")
            .startAfter(lastDoc)
            .limit(limit)
            .get()
        : await questionsRef.orderBy("createdAt", "desc").limit(limit).get();

      if (!qs.empty) {
        for (const doc of qs.docs) {
          numOfDoc++;
          if (numOfDoc === qs.docs.length) dispatch(setLastQuestionDocRef(doc));
          const question = doc.data() as QuestionSchemaRes;
          const questionId = doc.id;
          const isLiked = await checkIfUserLiked(questionId, "question");
          const questionProfileAvatar = await getUserAvatarUrlById(
            question.createdBy.userId
          );

          const questionForState: Question = {
            ...question,
            id: questionId,
            isLiked,
            createdBy: {
              ...question.createdBy,
              profileAvatar: questionProfileAvatar,
            },
          };
          questionsArray.push(questionForState);
        }
      } else {
        // If empty hasMore = false and send back a notification
        dispatch(
          setNotification({
            text: getNotificationMessage("no-more-questions"),
          })
        );
        dispatch(changeHasMoreQuestions(false));
        dispatch(loadingQuestions(false));
        return true;
      }
      if (questionsArray.length > 0)
        dispatch(populateQuestions(questionsArray));
      if (questionsArray.length < limit) {
        dispatch(changeHasMoreQuestions(false));
        dispatch(
          setNotification({ text: getNotificationMessage("no-more-questions") })
        );
      }
      dispatch(loadingQuestions(false));
      return true;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(loadingQuestions(false));
      console.error(err);
      return false;
    }
  };

export const getQuestion =
  (questionId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(loadingQuestions(true));
    // check in all questions
    let question = getState().questions.questions.filter(
      (question) => question.id === questionId
    )[0];
    // check in quriosityQuestions
    if (!question)
      question = getState().quriosityQuestions.questions.filter(
        (question) => question.id === questionId
      )[0];
    // check in likedQuestions
    if (!question)
      question = getState().likedQuestions.questions.filter(
        (question) => question.id === questionId
      )[0];
    // if found return question
    if (question) {
      dispatch(loadingQuestions(false));
      return question;
    }
    // if question is not in state get it from firestore
    try {
      const questionDoc = await firestoreRef
        .collection("questions")
        .doc(questionId)
        .get();
      if (questionDoc.exists) {
        const question = questionDoc.data() as QuestionSchemaRes;
        const isLiked = await checkIfUserLiked(questionDoc.id, "question");
        const questionProfileAvatar = await getUserAvatarUrlById(
          question.createdBy.userId
        );
        const questionForState: Question = {
          ...question,
          id: questionDoc.id,
          isLiked,
          createdBy: {
            ...question.createdBy,
            profileAvatar: questionProfileAvatar,
          },
        };
        dispatch(loadingQuestions(false));
        return questionForState;
      } else {
        dispatch(loadingQuestions(false));
        return false;
      }
    } catch (err) {
      console.error(err);
      dispatch(loadingQuestions(false));
      return false;
    }
  };

export const submitQuestion =
  (submitedQuestionData: { hashtags: string[]; question: string }) =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    // If user is logged in continue with question submition
    if (firebaseAuth.currentUser) {
      dispatch(setRequestActive(true));
      // if question is empty
      if (submitedQuestionData.question.trim().length < 1) {
        dispatch(
          setNotification({ text: getNotificationMessage("question-empty") })
        );
        dispatch(setRequestActive(false));

        return false;
      }

      const { hashtags, question } = submitedQuestionData;
      const userId = firebaseAuth.currentUser.uid;
      const userRef = await firestoreRef.doc(`users/${userId}`).get();
      const user = userRef.data() as UserSchema;

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const quriosityQuestions = getState().quriosityQuestions.questions;
      const hasMore = getState().quriosityQuestions.hasMore;
      if (user) {
        const newQuestion: QuestionSchema = {
          createdBy: {
            userId,
            name: user.name,
            username: user.username,
          },
          question,
          hashtags,
          likes: 0,
          numberOfShares: 0,
          createdAt: timestamp,
        };
        try {
          const questionDocRef = await firestoreRef
            .collection("questions")
            .add(newQuestion);
          // Updating recent activity
          const recentActivity: RecentActivitySchema[] = user.recentActivity
            ? [...user.recentActivity]
            : [];
          recentActivity && recentActivity.length === 3 && recentActivity.pop();
          recentActivity.unshift({
            createdAt: Date.now(),
            type: "asked",
            id: questionDocRef.id,
            title: question,
          });
          await firestoreRef.doc(`users/${userId}`).update({ recentActivity });

          dispatch(addRecentActivity(recentActivity));
          //******************************************** */

          const questionForState = {
            ...newQuestion,
            id: questionDocRef.id,
            isLiked: false,
            createdAt: Date.now(),
            createdBy: {
              profileAvatar: user.profileAvatar,
              name: user.name,
              userId: userId,
              username: user.username,
            },
          };
          dispatch(addQuestion(questionForState));

          quriosityQuestions.length > 0 &&
            dispatch(addQuriosityQuestion(questionForState));
          // adds a question only if other questions exist (fixes the doubling problem if the page wasn't visited before adding a new impact)

          quriosityQuestions.length <= 0 &&
            !hasMore &&
            dispatch(addQuriosityQuestion(questionForState));
          // adds a question if there are no other questions and hasMore is false which means that the page was visited but the user hasn't added anything to it

          dispatch(setRequestActive(false));
          return true;
        } catch (err) {
          dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
          dispatch(setRequestActive(false));
          console.error(err);
          return false;
        }
      } else {
        dispatch(
          setNotification({ text: getNotificationMessage("please-relog") })
        );
        dispatch(setRequestActive(false));

        return false;
      }
    } else {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      dispatch(setRequestActive(false));

      return false;
    }
  };

export const shareQuestion =
  (questionId: string) => async (dispatch: Dispatch) => {
    try {
      const incrementShare = firebase
        .functions()
        .httpsCallable("incrementQuestionShares");
      await incrementShare({ questionId });
      dispatch(incrementQuestionShares(questionId));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

// export const testPopulateQuestions = () => async (dispatch: Dispatch) => {
//   // If user is logged in continue with question submition
//   const questions = data.questions;
//   if (firebaseAuth.currentUser) {
//     const userId = firebaseAuth.currentUser.uid;
//     const userRef = await firestoreRef.doc(`users/${userId}`).get();
//     const user = userRef.data();
//     if (user) {
//       questions.forEach((question) => {
//         const { likes, hashtags, questionText } = question;
//         const newQuestion: QuestionSchema = {
//           createdBy: {
//             userId,
//             name: user.name,
//             username: user.username,
//           },
//           question: questionText,
//           hashtags: hashtags || [],
//           likes: likes,
//           numberOfShares: 0,
//           createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//         };
//         firestoreRef
//           .collection("questions")
//           .add(newQuestion)
//           .then((questionDocRef) => {
//             const questionForState = {
//               ...newQuestion,
//               id: questionDocRef.id,
//               isLiked: false,
//               createdAt: Date.now(),
//               createdBy: {
//                 profileAvatar: user.profileAvatar,
//                 name: user.name,
//                 userId: userId,
//                 username: user.username,
//               },
//             };
//             dispatch(addQuestion(questionForState));
//             return true;
//           })
//           .catch((err) => {
//             dispatch(
//               setNotification({ text: customFirebaseErrorMessage(err) })
//             );
//             console.error(err);
//             return false;
//           });
//       });
//     } else {
//       dispatch(
//         setNotification({ text: getNotificationMessage("please-relog") })
//       );
//       return false;
//     }
//   } else {
//     dispatch(
//       setNotification({ text: getNotificationMessage("login-required") })
//     );
//     return false;
//   }
// };
