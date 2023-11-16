import { DocumentData } from "@google-cloud/firestore";
import { Dispatch } from "redux";
import { firebaseAuth, firestoreRef } from "../../firebase";
import {
  PostQuestionAnswerSchemaRes,
  UserSchemaRes,
} from "../../responseSchemas";
import { PostQuestionAnswerSchema, PostQuestionSchema } from "../../schemas";
import firebase from "../../firebase";
import {
  PopulatePostQuestionAnswers,
  AddPostQuestionAnswer,
  SetIsAnswered,
  SetHasMore,
  HandleAnswerLikePostQuestionAnswers,
  SetLoadingQuestion,
  SetLoadingAnswers,
  SetLastAnswerDocRef,
  PostQuestionAnswer,
  PostQuestion,
  SubmitPostQuestionAnswerData,
  SetIsAnswerPrivate,
  PopulatePostQuestions,
  AddPostQuestion,
  SetUsersAnswer,
  HandleAnswerUnlikePostQuestionAnswers,
} from "./postQuestionAnswersTypes";
import { setNotification } from "../notifications/notificationActions";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import { setRequestActive } from "../appState/appStateActions";
import { RootState } from "..";
import { getRequestLimitByWindowWidth } from "../../helperFunctions";
import { checkIfUserLiked } from "../helperReduxThunkActions";

export const populatePostQuestions = (
  postQuestions: PostQuestion[]
): PopulatePostQuestions => ({
  type: "POPULATE_POST_QUESTIONS",
  payload: postQuestions,
});

export const addPostQuestion = (
  postQuestion: PostQuestion
): AddPostQuestion => ({
  type: "ADD_POST_QUESTION",
  payload: postQuestion,
});

export const populatePostQuestionAnswers = (
  postQuestionAnswers: PostQuestionAnswer[],
  questionId: string
): PopulatePostQuestionAnswers => ({
  type: "POPULATE_POST_QUESTION_ANSWERS",
  payload: postQuestionAnswers,
  questionId,
});

export const addPostQuestionAnswer = (
  answer: PostQuestionAnswer,
  questionId: string
): AddPostQuestionAnswer => ({
  type: "ADD_POST_QUESTION_ANSWER",
  payload: answer,
  questionId,
});

export const setUsersAnswer = (
  answer: PostQuestionAnswer | null,
  questionId: string
): SetUsersAnswer => ({
  type: "SET_USERS_ANSWER__POST_QUESTION_ANSWERS",
  payload: answer,
  questionId,
});

export const setLoadingQuestion = (isLoading: boolean): SetLoadingQuestion => ({
  type: "SET_LOADING_QUESTION__POST_QUESTION_ANSWERS",
  payload: isLoading,
});

export const setLoadingAnswers = (isLoading: boolean): SetLoadingAnswers => ({
  type: "SET_LOADING_ANSWERS__POST_QUESTION_ANSWERS",
  payload: isLoading,
});

export const setLastAnswerDocRef = (
  lastDocRef: DocumentData,
  questionId: string
): SetLastAnswerDocRef => ({
  type: "SET_LAST_ANSWER_DOC_REF__POST_QUESTION_ANSWERS",
  payload: lastDocRef,
  questionId,
});

export const setIsAnswered = (
  isAnswered: boolean,
  questionId: string
): SetIsAnswered => ({
  type: "SET_IS_ANSWERED__POST_QUESTION_ANSWERS",
  payload: isAnswered,
  questionId,
});

export const setHasMore = (
  hasMore: boolean,
  questionId: string
): SetHasMore => ({
  type: "SET_HAS_MORE__POST_QUESTION_ANSWERS",
  payload: hasMore,
  questionId,
});

export const HandlePostQuestionAnswerLike = (
  questionId: string,
  answerId: string
): HandleAnswerLikePostQuestionAnswers => ({
  type: "HANDLE_ANSWER_LIKE__POST_QUESTION_ANSWERS",
  payload: answerId,
  questionId,
});

export const HandlePostQuestionAnswerUnlike = (
  questionId: string,
  answerId: string
): HandleAnswerUnlikePostQuestionAnswers => ({
  type: "HANDLE_ANSWER_UNLIKE__POST_QUESTION_ANSWERS",
  payload: answerId,
  questionId,
});

export const setIsAnswerPrivate = (
  isPrivate: boolean,
  questionId: string
): SetIsAnswerPrivate => ({
  type: "SET_IS_ANSWER_PRIVATE__POST_QUESTION_ANSWERS",
  questionId,
  payload: isPrivate,
});

export const checkIfPostQuestionIsAnswered =
  (postId: string, questionId: string) =>
  async (dispatch: Dispatch): Promise<PostQuestionAnswer | false> => {
    if (!firebaseAuth.currentUser) return false;
    const userId = firebaseAuth.currentUser.uid;
    try {
      const qs = await firestoreRef
        .collection(`postQuestionAnswers`)
        .where("postId", "==", postId)
        .where("questionId", "==", questionId)
        .where("createdBy.userId", "==", userId)
        .get();
      if (qs.empty) {
        dispatch(setUsersAnswer(null, questionId));
        return false;
      }
      const answer = qs.docs[0].data() as PostQuestionAnswerSchemaRes;
      const isLiked = await checkIfUserLiked(
        qs.docs[0].id,
        "postQuestionAnswer"
      );
      const answerForState = {
        ...answer,
        isLiked,
        answerId: qs.docs[0].id,
      };
      dispatch(setUsersAnswer(answerForState, questionId));
      return answerForState;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

export const submitPostQuestionAnswer =
  (postQuestionAnswerData: SubmitPostQuestionAnswerData) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch(setRequestActive(true));

    if (!firebaseAuth.currentUser) {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      return false;
    }

    const { postId, questionId } = postQuestionAnswerData;
    const { text, isPrivate } = postQuestionAnswerData.answerData;
    const trimmedText = text.trim();
    const userId = firebaseAuth.currentUser.uid;
    let userData: UserSchemaRes;

    if (!trimmedText) {
      dispatch(
        setNotification({ text: getNotificationMessage("answer-empty") })
      );
      dispatch(setRequestActive(false));
      return false;
    }

    try {
      const userDocRef = await firestoreRef.doc(`users/${userId}`).get();
      if (!userDocRef.exists) {
        dispatch(setNotification({ text: getNotificationMessage("no-user") }));
        dispatch(setRequestActive(false));
        return false;
      }
      userData = userDocRef.data() as UserSchemaRes;
    } catch (err) {
      console.error(err);
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(setRequestActive(false));
      return false;
    }

    const { username, name } = userData;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const newAnswer: PostQuestionAnswerSchema = {
      postId,
      questionId,
      isPrivate,
      text: trimmedText,
      createdBy: {
        userFullName: name,
        userId,
        username,
      },
      updatedAt: timestamp,
      createdAt: timestamp,
      likes: 0,
    };
    try {
      const newAnswerRef = await firestoreRef
        .collection(`postQuestionAnswers`)
        .add(newAnswer);
      const answerId = newAnswerRef.id;
      const currentDate = Date.now();
      const clientTimestamp = new firebase.firestore.Timestamp(
        Math.round(currentDate / 1000),
        0
      );

      const answerForState = {
        ...newAnswer,
        createdAt: clientTimestamp,
        updatedAt: clientTimestamp,
        answerId,
        isLiked: false,
      };

      dispatch(setUsersAnswer(answerForState, questionId));
      dispatch(setRequestActive(false));
      return true;
    } catch (err) {
      console.error(err);
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(setRequestActive(false));
      return false;
    }
  };

export const togglePrivatePostQuestionAnswer =
  (questionId: string, answerId: string, isPrivate: boolean) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    try {
      await firestoreRef.doc(`postQuestionAnswers/${answerId}`).update({
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        isPrivate: !isPrivate,
      });
      dispatch(setIsAnswerPrivate(!isPrivate, questionId));
      dispatch(
        setNotification({
          text: isPrivate ? "Answer unprivated" : "Answer privated",
        })
      );
      return true;
    } catch (err) {
      console.error(err);
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      return false;
    }
  };

export const getPostQuestion =
  (postId: string, questionId: string) =>
  async (
    dispatch: Dispatch,
    getState: () => RootState
  ): Promise<false | PostQuestion> => {
    dispatch(setLoadingQuestion(true));
    const question = getState().postQuestionAnswers.questions.filter(
      (question) => question.questionId === questionId
    )[0];
    if (question) {
      dispatch(setLoadingQuestion(false));
      return question;
    }
    try {
      const qs = await firestoreRef
        .doc(`/posts/${postId}/questions/${questionId}`)
        .get();

      if (!qs.exists) {
        dispatch(setNotification({ text: 'Question doesn"t exist' }));
        dispatch(setLoadingQuestion(false));
        return false;
      }

      const question = qs.data() as PostQuestionSchema;
      const questionForState: PostQuestion = {
        ...question,
        questionId: qs.id,
        answers: [],
        hasMoreAnswers: true,
        lastAnswerDocRef: null,
      };
      dispatch(addPostQuestion(questionForState));
      dispatch(setLoadingQuestion(false));
      return questionForState;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(setLoadingQuestion(false));
      console.error(err);
      return false;
    }
  };

export const getPostQuestionAnswers =
  (postId: string, questionId: string) =>
  async (
    dispatch: Dispatch,
    getState: () => RootState
  ): Promise<false | PostQuestionAnswer[]> => {
    const question = getState().postQuestionAnswers.questions.filter(
      (question) => question.questionId === questionId
    )[0];
    if (question && !question.hasMoreAnswers) return false;
    dispatch(setLoadingAnswers(true));

    let answersArray: PostQuestionAnswer[] = [];
    const collectionRef = firestoreRef
      .collection(`postQuestionAnswers`)
      .where("postId", "==", postId)
      .where("questionId", "==", questionId);
    const lastDoc = question.lastAnswerDocRef;
    const limit = getRequestLimitByWindowWidth("postQuestionAnswers");
    let numOfDoc = 0;

    try {
      const qs = lastDoc
        ? await collectionRef
            .orderBy("createdAt", "desc")
            .where("isPrivate", "==", false)
            .startAfter(lastDoc)
            .limit(limit)
            .get()
        : await collectionRef
            .orderBy("createdAt", "desc")
            .where("isPrivate", "==", false)
            .limit(limit)
            .get();

      if (!qs.empty) {
        const currentUser = firebaseAuth.currentUser;
        for (const answerDoc of qs.docs) {
          numOfDoc++;
          if (numOfDoc === qs.docs.length)
            dispatch(setLastAnswerDocRef(answerDoc, questionId));
          const answer = answerDoc.data() as PostQuestionAnswerSchemaRes;
          const isLiked = await checkIfUserLiked(
            answerDoc.id,
            "postQuestionAnswer"
          );
          if (currentUser && currentUser.uid === answer.createdBy.userId)
            continue;
          answersArray.push({
            ...answer,
            answerId: answerDoc.id,
            isLiked,
          });
        }
        qs.docs.length > 0 &&
          dispatch(populatePostQuestionAnswers(answersArray, questionId));
        if (qs.docs.length < limit) {
          dispatch(
            setNotification({ text: getNotificationMessage("no-more-answers") })
          );
          dispatch(setHasMore(false, questionId));
        }
        dispatch(setLoadingAnswers(false));
        return answersArray;
      }
      if (qs.empty)
        dispatch(
          setNotification({ text: getNotificationMessage("no-more-answers") })
        );
      dispatch(setLoadingAnswers(false));
      return false;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(setLoadingAnswers(false));
      console.error(err);
      return false;
    }
  };

// export const testPopulateAnswers = async (
//   postId: string,
//   questionId: string
// ) => {
//   try {
//     const users = await firestoreRef.collection("users").get();
//     for (const user of users.docs) {
//       for (let i = 0; i < 1; i++) {
//         if (!firebaseAuth.currentUser) return;
//         if (firebaseAuth.currentUser.uid === user.data().uid) return;
//         const userData = user.data() as UserSchemaRes;
//         const timestamp = firebase.firestore.FieldValue.serverTimestamp();
//         const newAnswer: PostQuestionAnswerSchema = {
//           postId,
//           questionId,
//           createdBy: {
//             userFullName: userData.name,
//             userId: user.id,
//             username: userData.username,
//           },
//           isPrivate: false,
//           likes: 0,
//           text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. In quae repudiandae quaerat nisi est alias optio explicabo minus adipisci provident?",
//           createdAt: timestamp,
//           updatedAt: timestamp,
//         };
//         try {
//           const newAnswerDocRef = await firestoreRef
//             .collection(`postQuestionAnswers`)
//             .add(newAnswer);
//           console.log(newAnswerDocRef.id);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
