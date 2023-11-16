import {
  addObjectToArrayIfUnique,
  makeArrayOfObjectsUnique,
} from "../../helperFunctions";
import { UserImapctsState, UserImpactsActionTypes } from "./userImpactsTypes";

const userImpactsState: UserImapctsState = {
  questions: [],
  answers: [],
  loading: true,
  hasMore: true,
  lastImpactDocRef: null,
};

const userImpactsReducer = (
  state = userImpactsState,
  action: UserImpactsActionTypes
): UserImapctsState => {
  switch (action.type) {
    case "POPULATE_USER_IMAPCTS":
      return {
        ...state,
        answers: makeArrayOfObjectsUnique(
          [...state.answers, ...action.payload],
          "id"
        ),
      };

    case "POPULATE_USER_IMAPCTS_QUESTIONS":
      return {
        ...state,
        questions: makeArrayOfObjectsUnique(
          [...state.questions, ...action.payload],
          "id"
        ),
      };

    case "ADD_USER_IMPACT":
      return {
        ...state,
        answers: addObjectToArrayIfUnique(
          [...state.answers],
          action.payload,
          "id"
        ),
      };

    case "ADD_USER_IMPACT_QUESTION":
      return {
        ...state,
        questions: addObjectToArrayIfUnique(
          [...state.questions],
          action.payload,
          "id"
        ),
      };

    case "CHANGE_HAS_MORE_USER_IMAPCTS":
      return {
        ...state,
        hasMore: action.payload,
      };

    case "LOADING_USER_IMAPCTS":
      return {
        ...state,
        loading: action.payload,
      };

    case "HANDLE_USER_IMPACT_LIKE":
      return {
        ...state,
        answers: state.answers.map((answer) => {
          if (answer.id !== action.payload) return { ...answer };
          else return { ...answer, likes: answer.likes + 1, isLiked: true };
        }),
      };

    case "HANDLE_USER_IMPACT_UNLIKE":
      return {
        ...state,
        answers: state.answers.map((answer) => {
          if (answer.id !== action.payload) return { ...answer };
          else return { ...answer, likes: answer.likes - 1, isLiked: false };
        }),
      };

    case "SET_LAST_USER_IMPACT_DOC_REF":
      return {
        ...state,
        lastImpactDocRef: action.payload,
      };

    default:
      return state;
  }
};

export default userImpactsReducer;
