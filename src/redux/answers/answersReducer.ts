import { addObjectToArrayIfUnique } from "../../helperFunctions";
import { AnswerActionTypes, AnswersState } from "./answersTypes";

const answersState: AnswersState = {
  answers: [],
  loading: false,
  statusOfAnswers: [],
};

const answersReducer = (
  state = answersState,
  action: AnswerActionTypes
): AnswersState => {
  switch (action.type) {
    case "POPULATE_ANSWERS":
      return {
        ...state,
        answers: [...state.answers, ...action.payload],
      };

    case "POPULATE_STATUS_OF_ANSWERS":
      return {
        ...state,
        statusOfAnswers: addObjectToArrayIfUnique(
          [...state.statusOfAnswers],
          action.payload,
          "questionId"
        ),
      };

    case "LOADING_ANSWERS":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_LAST_ANSWER_DOC_REF":
      return {
        ...state,
        statusOfAnswers: state.statusOfAnswers.map((statusOfAnswers) => {
          if (statusOfAnswers.questionId === action.questionId)
            return { ...statusOfAnswers, lastDocRef: action.payload };
          else return { ...statusOfAnswers };
        }),
      };

    case "CHANGE_HAS_MORE_ANSWERS":
      return {
        ...state,
        statusOfAnswers: state.statusOfAnswers.map((statusOfAnswers) => {
          if (statusOfAnswers.questionId === action.questionId)
            return { ...statusOfAnswers, hasMore: action.payload };
          else return { ...statusOfAnswers };
        }),
      };

    case "HANDLE_ANSWER_LIKE":
      return {
        ...state,
        answers: state.answers.map((answer) => {
          if (answer.id !== action.payload) return { ...answer };
          else return { ...answer, likes: answer.likes + 1, isLiked: true };
        }),
      };

    case "HANDLE_ANSWER_UNLIKE":
      return {
        ...state,
        answers: state.answers.map((answer) => {
          if (answer.id !== action.payload) return { ...answer };
          else return { ...answer, likes: answer.likes - 1, isLiked: false };
        }),
      };

    case "ADD_ANSWER":
      return {
        ...state,
        answers: [action.payload, ...state.answers],
      };

    case "CHANGE_HAS_ANSWERED":
      return {
        ...state,
        statusOfAnswers: state.statusOfAnswers.map((statusOfAnswers) => {
          if (statusOfAnswers.questionId === action.questionId)
            return { ...statusOfAnswers, hasAnswered: action.payload };
          else return { ...statusOfAnswers };
        }),
      };

    default:
      return state;
  }
};

export default answersReducer;
