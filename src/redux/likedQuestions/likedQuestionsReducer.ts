import {
  addObjectToArrayIfUnique,
  makeArrayOfObjectsUnique,
} from "../../helperFunctions";
import {
  LikedQuestionsActionTypes,
  LikedQuestionsState,
} from "./likedQuestionsTypes";

const likedQuestionsState: LikedQuestionsState = {
  questions: [],
  hasMore: true,
  loading: true,
  lastLikedQuestionRef: "",
};

const likedQuestionsReducer = (
  state = likedQuestionsState,
  action: LikedQuestionsActionTypes
): LikedQuestionsState => {
  switch (action.type) {
    case "POPULATE_LIKED_QUESTIONS":
      return {
        ...state,
        questions: makeArrayOfObjectsUnique(
          [...state.questions, ...action.payload],
          "id"
        ),
      };

    case "ADD_LIKED_QUESTION":
      return {
        ...state,
        questions: addObjectToArrayIfUnique(
          [...state.questions],
          action.payload,
          "id"
        ),
      };

    case "LOADING_LIKED_QUESTIONS":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_LAST_LIKED_QUESTION_REF":
      return {
        ...state,
        lastLikedQuestionRef: action.payload,
      };

    case "HANDLE_LIKED_QUESTION_LIKE":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.id !== action.payload) return { ...question };
          else return { ...question, likes: question.likes + 1, isLiked: true };
        }),
      };

    case "HANDLE_LIKED_QUESTION_UNLIKE":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.id !== action.payload) return { ...question };
          else
            return { ...question, likes: question.likes - 1, isLiked: false };
        }),
      };

    case "CHANGE_HAS_MORE_LIKED_QUESTIONS":
      return {
        ...state,
        hasMore: action.payload,
      };

    default:
      return state;
  }
};

export default likedQuestionsReducer;
