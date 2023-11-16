import { makeArrayOfObjectsUnique } from "../../helperFunctions";
import { QuestionsState, QuestionsActionTypes } from "./questionsTypes";

const questionsState: QuestionsState = {
  questions: [],
  loading: true,
  hasMore: true,
  lastQuestionDocRef: null,
};

const questionsReducer = (
  state = questionsState,
  action: QuestionsActionTypes
): QuestionsState => {
  switch (action.type) {
    case "POPULATE_QUESTIONS":
      return {
        ...state,
        questions: makeArrayOfObjectsUnique(
          [...state.questions, ...action.payload],
          "id"
        ),
      };

    case "ADD_QUESTION":
      return {
        ...state,
        questions: [action.payload, ...state.questions],
      };

    case "LOADING_QUESTIONS":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_LAST_QUESTION_DOC_REF":
      return {
        ...state,
        lastQuestionDocRef: action.payload,
      };

    case "CHANGE_HAS_MORE_QUESTIONS":
      return {
        ...state,
        hasMore: false,
      };

    case "HANDLE_QUESTION_LIKE":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.id !== action.payload) return { ...question };
          else return { ...question, likes: question.likes + 1, isLiked: true };
        }),
      };

    case "HANDLE_QUESTION_UNLIKE":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.id !== action.payload) return { ...question };
          else
            return { ...question, likes: question.likes - 1, isLiked: false };
        }),
      };

    case "INCREMENT_QUESTION_SHARES":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.id !== action.payload) return { ...question };
          else
            return { ...question, numberOfShares: question.numberOfShares + 1 };
        }),
      };
    default:
      return state;
  }
};

export default questionsReducer;
