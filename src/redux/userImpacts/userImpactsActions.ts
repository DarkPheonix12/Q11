import { DocumentData } from "@google-cloud/firestore";
import { Dispatch } from "redux";
import firebase, { firebaseAuth, firestoreRef } from "../../firebase";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";
import { getUserAvatarUrlById } from "../../helperFunctions/firebaseUserActions";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import { AnswerSchemaRes, QuestionSchemaRes } from "../../responseSchemas";
import { Answer } from "../answers/answersTypes";
import { checkIfUserLiked } from "../helperReduxThunkActions";
import { setNotification } from "../notifications/notificationActions";
import { Question } from "../questions/questionsTypes";
import { RootState } from "../rootReducer";

export const populateUserImpacts = (userImpacts: Answer[]) => ({
  type: "POPULATE_USER_IMAPCTS",
  payload: userImpacts,
});

export const populateUserImpactsQuestions = (
  userImpactsQuestions: Question[]
) => ({
  type: "POPULATE_USER_IMAPCTS_QUESTIONS",
  payload: userImpactsQuestions,
});

export const addUserImpact = (userImpact: Answer) => ({
  type: "ADD_USER_IMPACT",
  payload: userImpact,
});

export const addUserImpactQuestion = (userImpactQuestion: Question) => ({
  type: "ADD_USER_IMPACT_QUESTION",
  payload: userImpactQuestion,
});

export const loadingUserImpacts = (loading: boolean) => ({
  type: "LOADING_USER_IMAPCTS",
  payload: loading,
});

export const changeHasMoreUserImpacts = (hasMore: boolean) => ({
  type: "CHANGE_HAS_MORE_USER_IMAPCTS",
  payload: hasMore,
});

export const handleUserImpactLike = (answerId: string) => ({
  type: "HANDLE_USER_IMPACT_LIKE",
  payload: answerId,
});

export const handleUserImpactUnlike = (answerId: string) => ({
  type: "HANDLE_USER_IMPACT_UNLIKE",
  payload: answerId,
});

export const setLastUserImpactDocRef = (
  lastUserImapctDocRef: DocumentData
) => ({
  type: "SET_LAST_USER_IMPACT_DOC_REF",
  payload: lastUserImapctDocRef,
});

export const getUserImpactsAndQuestions =
  () => async (dispatch: Dispatch, getState: () => RootState) => {
    // If there are no more questions to load
    if (!getState().userImpacts.hasMore) return false;

    dispatch(loadingUserImpacts(true));
    const answers: Answer[] = [];
    const questions: Question[] = [];
    const questionPromises: Promise<
      firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
    >[] = [];
    const lastDoc = getState().userImpacts.lastImpactDocRef;
    const limit = 10;
    const answersRef = firestoreRef.collection("answers");
    const currentUserId =
      firebaseAuth.currentUser && firebaseAuth.currentUser.uid;
    let numOfDoc = 0;

    try {
      const qs = lastDoc
        ? await answersRef
            .orderBy("createdAt", "desc")
            .startAfter(lastDoc)
            .where("createdBy.userId", "==", currentUserId)
            .limit(limit)
            .get()
        : await answersRef
            .orderBy("createdAt", "desc")
            .where("createdBy.userId", "==", currentUserId)
            .limit(limit)
            .get();

      if (!qs.empty) {
        for (const doc of qs.docs) {
          numOfDoc++;
          if (numOfDoc === qs.docs.length)
            dispatch(setLastUserImpactDocRef(doc)); // Setting the last doc ref when the number of docs equals query length

          const answer = doc.data() as AnswerSchemaRes;
          const isLiked = await checkIfUserLiked(doc.id, "answer");

          const questionQuery = firestoreRef
            .doc(`questions/${answer.questionId}`)
            .get();
          questionPromises.push(questionQuery);

          answers.push({
            ...answer,
            id: doc.id,
            isLiked,
            createdBy: { ...answer.createdBy, profileAvatar: "" },
          });
        }

        const res = await Promise.all(questionPromises);
        for (const questionDocRef of res) {
          if (questionDocRef.exists) {
            const questionData = questionDocRef.data() as QuestionSchemaRes;
            const isQuestionLiked = await checkIfUserLiked(
              questionDocRef.id,
              "question"
            );

            const questionProfileAvatar = await getUserAvatarUrlById(
              questionData.createdBy.userId
            );
            const questionForState: Question = {
              ...questionData,
              isLiked: isQuestionLiked,
              id: questionDocRef.id,
              createdBy: {
                ...questionData.createdBy,
                profileAvatar: questionProfileAvatar,
              },
            };
            questions.push(questionForState);
          }
        }
      } else {
        // If empty hasMore = false and send back a notification
        dispatch(
          setNotification({ text: getNotificationMessage("no-more-answers") })
        );
        dispatch(changeHasMoreUserImpacts(false));
        dispatch(loadingUserImpacts(false));
        return true;
      }
      questions.length > 0 && dispatch(populateUserImpactsQuestions(questions));
      answers.length > 0 && dispatch(populateUserImpacts(answers));
      if (answers.length < limit) {
        setNotification({ text: getNotificationMessage("no-more-answers") });
        dispatch(changeHasMoreUserImpacts(false));
      }
      dispatch(loadingUserImpacts(false));
      return true;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(loadingUserImpacts(false));
      console.error(err);
      return false;
    }
  };
