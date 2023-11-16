import { Dispatch } from "redux";
import {
  handleQuestionLike,
  handleQuestionUnlike,
  handleQuriosityQuestionLike,
  handleQuriosityQuestionUnlike,
  setNotification,
} from ".";
import firebase, { firebaseAuth, firestoreRef } from "../firebase";
import { getNotificationMessage } from "../helperFunctions/customNotificationMessages";
import { customFirebaseErrorMessage } from "../helperFunctions/firestoreErrorHandler";
import { updateLocalUserActivity } from "../helperFunctions/localStorageActions";
import { handleAnswerLike, handleAnswerUnlike } from "./answers/answersActions";
import {
  addLikedQuestion,
  handleLikedQuestionLike,
  handleLikedQuestionUnlike,
} from "./likedQuestions/likedQuestionsActions";
import {
  HandlePostQuestionAnswerLike,
  HandlePostQuestionAnswerUnlike,
} from "./postQuestionAnswers/postQuestionAnswersActions";
import { RootState } from "./rootReducer";
import {
  updateAnswerLikes,
  updatePostQuestionAnswerLikes,
  updateQuestionLikes,
} from "./userActivity/userActivityActions";
import {
  handleUserImpactLike,
  handleUserImpactUnlike,
} from "./userImpacts/userImpactsActions";

export interface LikeData {
  type: "question" | "answer" | "postQuestionAnswer";
  refId: string;
  postQuestionId?: string;
}

// can be potentially used to add a like to any document
export const like =
  (likeData: LikeData) =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    const loggedIn = checkIfLoggedInAndDisplayNotification()(dispatch);
    if (!loggedIn) return false;
    const { type, refId, postQuestionId } = likeData;

    // update state first, reset if error
    switch (type) {
      case "answer": {
        dispatch(updateAnswerLikes(refId));
        dispatch(handleAnswerLike(refId));
        dispatch(handleUserImpactLike(refId));
        break;
      }
      case "question": {
        dispatch(updateQuestionLikes(refId));
        dispatch(handleQuestionLike(refId));
        dispatch(handleLikedQuestionLike(refId));
        dispatch(handleQuriosityQuestionLike(refId));
        break;
      }
      case "postQuestionAnswer": {
        if (!postQuestionId) return false;
        dispatch(updatePostQuestionAnswerLikes(refId));
        dispatch(HandlePostQuestionAnswerLike(postQuestionId, refId));
        break;
      }
    }

    const localUserActivity = localStorage.getItem("userActivity");
    const localUserActivityParsed =
      localUserActivity && JSON.parse(localUserActivity);
    let userId: string;
    if (firebaseAuth.currentUser) userId = firebaseAuth.currentUser.uid;
    else return false;

    try {
      await firestoreRef // Update User Activity
        .doc(`userActivity/${userId}`)
        .update({
          [`${type}Likes`]: firebase.firestore.FieldValue.arrayUnion(refId),
        });

      // if question - find and add the question to likedQuestions
      if (type === "question") {
        const quriosityQuestions = getState().quriosityQuestions.questions;
        const questions = getState().questions.questions;

        const question = [...questions, ...quriosityQuestions].filter(
          (question) => question.id === refId
        )[0];

        question && dispatch(addLikedQuestion(question));
      }

      updateLocalUserActivity({
        [`${type}Likes`]: [...localUserActivityParsed[`${type}Likes`], refId],
      });

      return true;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));

      switch (type) {
        case "answer": {
          dispatch(updateAnswerLikes(refId));
          dispatch(handleAnswerUnlike(refId));
          dispatch(handleUserImpactUnlike(refId));
          break;
        }

        case "question": {
          dispatch(updateQuestionLikes(refId));
          dispatch(handleQuestionUnlike(refId));
          dispatch(handleLikedQuestionUnlike(refId));
          dispatch(handleQuriosityQuestionUnlike(refId));
          break;
        }

        case "postQuestionAnswer": {
          if (!postQuestionId) return false;
          dispatch(updatePostQuestionAnswerLikes(refId));
          dispatch(HandlePostQuestionAnswerUnlike(postQuestionId, refId));
          break;
        }
      }

      console.error(err);
      return false;
    }
  };
// can be potentially used to unlike any document
export const unlike =
  (unlikeData: LikeData) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    const loggedIn = checkIfLoggedInAndDisplayNotification()(dispatch);
    if (!loggedIn) return false;

    const { type, refId, postQuestionId } = unlikeData;
    // update state first, reset if error
    switch (type) {
      case "answer": {
        dispatch(updateAnswerLikes(refId));
        dispatch(handleAnswerUnlike(refId));
        dispatch(handleUserImpactUnlike(refId));
        break;
      }

      case "question": {
        dispatch(updateQuestionLikes(refId));
        dispatch(handleQuestionUnlike(refId));
        dispatch(handleLikedQuestionUnlike(refId));
        dispatch(handleQuriosityQuestionUnlike(refId));
        break;
      }

      case "postQuestionAnswer": {
        if (!postQuestionId) return false;
        dispatch(updatePostQuestionAnswerLikes(refId));
        dispatch(HandlePostQuestionAnswerUnlike(postQuestionId, refId));
        break;
      }
    }

    const localUserActivity = localStorage.getItem("userActivity");
    const localUserActivityParsed =
      localUserActivity && JSON.parse(localUserActivity);
    let userId: string;
    if (firebaseAuth.currentUser) userId = firebaseAuth.currentUser.uid;
    else return false;

    try {
      await firestoreRef.doc(`userActivity/${userId}`).update({
        [`${type}Likes`]: firebase.firestore.FieldValue.arrayRemove(refId),
      });

      updateLocalUserActivity({
        [`${type}Likes`]: localUserActivityParsed[`${type}Likes`].filter(
          (like: string) => like !== refId
        ),
      });
      return true;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      switch (type) {
        case "answer": {
          dispatch(updateAnswerLikes(refId));
          dispatch(handleAnswerLike(refId));
          dispatch(handleUserImpactLike(refId));
          break;
        }
        case "question": {
          dispatch(updateQuestionLikes(refId));
          dispatch(handleQuestionLike(refId));
          dispatch(handleLikedQuestionLike(refId));
          dispatch(handleQuriosityQuestionLike(refId));
          break;
        }
        case "postQuestionAnswer": {
          if (!postQuestionId) return false;
          dispatch(updatePostQuestionAnswerLikes(refId));
          dispatch(HandlePostQuestionAnswerLike(postQuestionId, refId));
          break;
        }
      }
      console.error(err);
      return false;
    }
  };

export const checkIfUserLiked = async (
  refId: string,
  type: "question" | "answer" | "postQuestionAnswer"
): Promise<boolean> => {
  if (firebaseAuth.currentUser) {
    let localUserActivity = localStorage.getItem("userActivity");
    if (!localUserActivity) {
      // If user is still logged in but they delted userActivity from local storage
      try {
        const userActivity = await firestoreRef
          .doc(`userActivity/${firebaseAuth.currentUser.uid}`)
          .get();
        const userActivityInfo = userActivity.data();
        localStorage.setItem("userActivity", JSON.stringify(userActivityInfo));
        localUserActivity = localStorage.getItem("userActivity");
      } catch (err) {
        console.error(err);
      }
    }
    const localUserActivityParsed =
      localUserActivity && JSON.parse(localUserActivity);
    const arrayOfLikesToCheckIn = localUserActivityParsed[`${type}Likes`];
    if (!arrayOfLikesToCheckIn) return false;
    return arrayOfLikesToCheckIn.includes(refId) || false;
  } else return false;
};

const checkIfLoggedInAndDisplayNotification = () => (dispatch: Dispatch) => {
  if (!firebaseAuth.currentUser) {
    dispatch(
      setNotification({ text: getNotificationMessage("login-required") })
    );
    return false;
  } else return true;
};
