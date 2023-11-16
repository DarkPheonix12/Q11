import { DocumentData } from "@google-cloud/firestore";
import firebase from "firebase";
import { Dispatch } from "redux";
import { setNotification } from "..";
import { firebaseAuth, firestoreRef } from "../../firebase";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";
import { getUserAvatarUrlById } from "../../helperFunctions/firebaseUserActions";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import { AnswerSchema } from "../../schemas";
import { setRequestActive } from "../appState/appStateActions";
import { checkIfUserLiked } from "../helperReduxThunkActions";
import { Question } from "../questions/questionsTypes";
import { RootState } from "../rootReducer";
import {
  addUserImpact,
  addUserImpactQuestion,
} from "../userImpacts/userImpactsActions";
import {
  AddAnswer,
  Answer,
  ChangeHasAnswered,
  ChangeHasMoreAnswers,
  HandleAnswerLike,
  HandleAnswerUnlike,
  LoadingAnswers,
  PopulateAnswers,
  PopulateStatusOfAnswers,
  SetLastAnswerDocRef,
  StatusOfAnswers,
} from "./answersTypes";

export const populateAnswers = (
  questionId: string,
  payload: Answer[]
): PopulateAnswers => ({
  type: "POPULATE_ANSWERS",
  payload,
  questionId,
});

export const loadingAnswers = (payload: boolean): LoadingAnswers => ({
  type: "LOADING_ANSWERS",
  payload,
});

export const setLastAnswerDocRef = (
  questionId: string,
  payload: DocumentData
): SetLastAnswerDocRef => ({
  type: "SET_LAST_ANSWER_DOC_REF",
  payload,
  questionId,
});

export const populateStatusOfAnswers = (
  payload: StatusOfAnswers
): PopulateStatusOfAnswers => ({
  type: "POPULATE_STATUS_OF_ANSWERS",
  payload,
});

export const changeHasMoreAnswers = (
  questionId: string,
  payload: boolean
): ChangeHasMoreAnswers => ({
  type: "CHANGE_HAS_MORE_ANSWERS",
  questionId,
  payload,
});

export const handleAnswerLike = (payload: string): HandleAnswerLike => ({
  type: "HANDLE_ANSWER_LIKE",
  payload,
});

export const handleAnswerUnlike = (payload: string): HandleAnswerUnlike => ({
  type: "HANDLE_ANSWER_UNLIKE",
  payload,
});

export const addAnswer = (payload: Answer): AddAnswer => ({
  type: "ADD_ANSWER",
  payload,
});

export const changeHasAnswered = (
  questionId: string,
  payload: boolean
): ChangeHasAnswered => ({
  type: "CHANGE_HAS_ANSWERED",
  payload,
  questionId,
});

export const getAnswers =
  (questionId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    // If there are no more questions to load
    const statusOfAnswers = getState().answers.statusOfAnswers.filter((ref) => {
      if (ref.questionId !== questionId) return null;
      return ref;
    })[0];
    if (statusOfAnswers && !statusOfAnswers.hasMore) return false;

    dispatch(loadingAnswers(true));
    const answersArray: Answer[] = [];
    const answersRef = firestoreRef.collection("answers");

    try {
      const lastAnswerDocRef =
        (statusOfAnswers && statusOfAnswers.lastDocRef) || null;
      let limit = 5;
      let numOfDoc = 0;

      const qs = lastAnswerDocRef // Query Snapshot depends on if lastAnswerDocRef is present
        ? await answersRef
            .orderBy("createdAt", "desc")
            .startAfter(lastAnswerDocRef)
            .where("questionId", "==", questionId)
            .limit(limit)
            .get()
        : await answersRef
            .orderBy("createdAt", "desc")
            .where("questionId", "==", questionId)
            .limit(limit)
            .get();

      if (!qs.empty) {
        for (const doc of qs.docs) {
          numOfDoc++;
          if (numOfDoc === qs.docs.length) {
            const isAnswered = await checkIfUserAlreadyAnswered(questionId);
            if (!statusOfAnswers) {
              const newStatusOfAnswers: StatusOfAnswers = {
                questionId,
                lastDocRef: doc,
                hasMore: true,
                hasAnswered: isAnswered,
              };
              dispatch(populateStatusOfAnswers(newStatusOfAnswers));
            } else {
              dispatch(setLastAnswerDocRef(questionId, doc));
            }
          }
          const answer = doc.data() as Answer;
          answer.questionId = questionId;
          const isLiked = await checkIfUserLiked(doc.id, "answer");
          answer.createdBy.profileAvatar = await getUserAvatarUrlById(
            answer.createdBy.userId
          );

          answersArray.push({ ...answer, id: doc.id, isLiked });
        }
      } else {
        const newStatusOfAnswers: StatusOfAnswers = {
          questionId,
          lastDocRef: null,
          hasMore: false,
          hasAnswered: false,
        };
        dispatch(populateStatusOfAnswers(newStatusOfAnswers));
        dispatch(
          setNotification({ text: getNotificationMessage("no-more-answers") })
        );
        dispatch(changeHasMoreAnswers(questionId, false));
        dispatch(loadingAnswers(false));
        return true;
      }
      if (answersArray.length > 0)
        dispatch(populateAnswers(questionId, answersArray));
      if (answersArray.length < limit) {
        dispatch(
          setNotification({ text: getNotificationMessage("no-more-answers") })
        );
        dispatch(changeHasMoreAnswers(questionId, false));
      }
      dispatch(loadingAnswers(false));
      return true;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(loadingAnswers(false));
      console.error(err);
      return false;
    }
  };

export const submitAnswer =
  (answerData: {
    text: string;
    questionObj: Question; // Requires the entire object because people can land on a specific question page and it doesn't get stored in state currently
  }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setRequestActive(true));
    if (answerData.text.trim().length < 1) {
      dispatch(
        setNotification({ text: getNotificationMessage("answer-empty") })
      );
      dispatch(setRequestActive(false));

      return false;
    }
    const { text, questionObj } = answerData;
    const questionId = questionObj.id;
    if (firebaseAuth.currentUser) {
      if (!text.trim()) {
        dispatch(
          setNotification({ text: getNotificationMessage("answer-empty") })
        );
        return false;
      }
      try {
        const userRef = await firestoreRef
          .doc(`/users/${firebaseAuth.currentUser.uid}`)
          .get();
        const user = userRef.data();

        if (!user) {
          dispatch(
            setNotification({ text: getNotificationMessage("no-user") })
          );
          dispatch(setRequestActive(false));

          return false;
        }

        const newAnswer: AnswerSchema = {
          answer: text,
          createdBy: {
            userId: firebaseAuth.currentUser.uid,
            name: user.name,
            username: user.username,
          },
          likes: 0,
          questionId,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        const newAnswerRef = await firestoreRef
          .collection("answers")
          .add(newAnswer);

        const newAnswerForState = {
          ...newAnswer,
          id: newAnswerRef.id,
          createdAt: Date.now(),
          isLiked: false,
          createdBy: {
            userId: firebaseAuth.currentUser.uid,
            name: user.name,
            profileAvatar: user.profileAvatar,
            username: user.username,
          },
        };
        dispatch(addAnswer(newAnswerForState));
        dispatch(addUserImpact(newAnswerForState));
        dispatch(addUserImpactQuestion(questionObj));
        dispatch(changeHasAnswered(questionId, true));
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
        setNotification({ text: getNotificationMessage("login-required") })
      );
      dispatch(setRequestActive(false));
      return false;
    }
  };

export const checkIfUserAlreadyAnswered = async (questionId: string) => {
  const user = firebaseAuth.currentUser;
  if (user) {
    const userAnswer = await firestoreRef
      .collection("answers")
      .where("questionId", "==", questionId)
      .where("createdBy.userId", "==", user.uid)
      .get();
    return !userAnswer.empty; // Return false if empty and true if not
  } else return false;
};

// export const testPopulateAnswers = (questionId: string) => async (
//   dispatch: Dispatch
// ) => {
//   // If user is logged in continue with question submition
//   const answers = [
//     {
//       text:
//         "I think Superman has the power and strength but Batman @dfwefew has the smarts. He could figure out a way to block out the sun and get kryptonite to defeat Superman!",
//       likes: 980,
//     },
//     {
//       text:
//         "I think Superman has the power and strength but Batman has the smarts. He could figure out a way to block out the sun and get kryptonite to defeat Superman!",
//       likes: 980,
//     },
//     {
//       text:
//         "@vrundpatel @deniseQ I really don’t think there’s any competition. Superman wins by a long shot.",
//       likes: 3679842,
//     },
//     {
//       text:
//         "I think Superman has the power and strength but Batman has the smarts. He could figure out a way to block out the sun and get kryptonite to defeat Superman!",
//       likes: 456987,
//     },
//     {
//       text:
//         "@vrundpatel @deniseQ I really don’t think there’s any competition. Superman wins by a long shot.",
//       likes: 250,
//     },
//     {
//       text:
//         "I think Superman has the power and strength but Batman has the smarts. He could figure out a way to block out the sun and get kryptonite to defeat Superman!",
//       likes: 1560,
//     },
//     {
//       text:
//         "@vrundpatel @deniseQ I really don’t think there’s any competition. Superman wins by a long shot.",
//       likes: 32689,
//     },
//     {
//       text:
//         "I think Superman has the power and strength but Batman @dfwefew has the smarts. He could figure out a way to block out the sun and get kryptonite to defeat Superman!",
//       likes: 980,
//     },
//     {
//       text:
//         "I think Superman has the power and strength but Batman has the smarts. He could figure out a way to block out the sun and get kryptonite to defeat Superman!",
//       likes: 980,
//     },
//     {
//       text:
//         "@vrundpatel @deniseQ I really don’t think there’s any competition. Superman wins by a long shot.",
//       likes: 3679842,
//     },
//     {
//       text:
//         "I think Superman has the power and strength but Batman has the smarts. He could figure out a way to block out the sun and get kryptonite to defeat Superman!",
//       likes: 456987,
//     },
//     {
//       text:
//         "@vrundpatel @deniseQ I really don’t think there’s any competition. Superman wins by a long shot.",
//       likes: 250,
//     },
//     {
//       text:
//         "I think Superman has the power and strength but Batman has the smarts. He could figure out a way to block out the sun and get kryptonite to defeat Superman!",
//       likes: 1560,
//     },
//     {
//       text:
//         "@vrundpatel @deniseQ I really don’t think there’s any competition. Superman wins by a long shot.",
//       likes: 32689,
//     },
//   ];
//   if (firebaseAuth.currentUser) {
//     const userId = firebaseAuth.currentUser.uid;
//     const userRef = await firestoreRef.doc(`users/${userId}`).get();
//     const user = userRef.data();
//     if (user) {
//       const newAnswers: Answer[] = [];
//       answers.forEach((answer) => {
//         const { likes, text } = answer;
//         const newAnswer: AnswerSchema = {
//           createdBy: {
//             userId,
//             name: user.name,
//             username: user.username,
//           },
//           questionId,
//           answer: text,
//           likes: likes,
//           createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//         };
//         firestoreRef
//           .collection("answers")
//           .add(newAnswer)
//           .then((answerDocRef) => {
//             const newAnswerForState = {
//               ...newAnswer,
//               id: answerDocRef.id,
//               createdAt: Date.now(),
//               isLiked: false,
//               createdBy: {
//                 userId,
//                 name: user.name,
//                 profileAvatar: user.profileAvatar,
//                 username: user.username,
//               },
//             };
//             newAnswers.push(newAnswerForState);
//           })
//           .catch((err) => {
//             dispatch(
//               setNotification({ text: customFirebaseErrorMessage(err) })
//             );
//             console.error(err);
//             return false;
//           });
//       });
//       dispatch(populateAnswers(questionId, newAnswers));
//       return true;
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
