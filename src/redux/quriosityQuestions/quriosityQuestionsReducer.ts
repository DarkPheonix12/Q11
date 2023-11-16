import { makeArrayOfObjectsUnique } from "../../helperFunctions";
import {
  QuriosityQuestionsActionTypes,
  QuriosityQuestionsState,
} from "./quriosityQuestionsTypes";

const quriosityQuestionsState: QuriosityQuestionsState = {
  questions: [],
  hasMore: true,
  loading: true,
  lastQuestionDocRef: null,
};

const quriosityQuestionsReducer = (
  state = quriosityQuestionsState,
  action: QuriosityQuestionsActionTypes
): QuriosityQuestionsState => {
  switch (action.type) {
    case "POPULATE_QURIOSITY_QUESTIONS":
      return {
        ...state,
        questions: makeArrayOfObjectsUnique(
          [...state.questions, ...action.payload],
          "id"
        ),
      };

    case "ADD_QURIOSITY_QUESTION":
      return {
        ...state,
        questions: [action.payload, ...state.questions],
      };

    case "LOADING_QURIOSITY_QUESTIONS":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_LAST_QURIOSITY_QUESTION_DOC_REF":
      return {
        ...state,
        lastQuestionDocRef: action.payload,
      };

    case "HANDLE_QURIOSITY_QUESTION_LIKE":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.id !== action.payload) return { ...question };
          else return { ...question, likes: question.likes + 1, isLiked: true };
        }),
      };

    case "HANDLE_QURIOSITY_QUESTION_UNLIKE":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.id !== action.payload) return { ...question };
          else
            return { ...question, likes: question.likes - 1, isLiked: false };
        }),
      };

    case "CHANGE_HAS_MORE_QURIOSITY_QUESTIONS":
      return {
        ...state,
        hasMore: action.payload,
      };

    default:
      return state;
  }
};

export default quriosityQuestionsReducer;
