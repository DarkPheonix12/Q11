import { makeArrayOfObjectsUnique } from "../../helperFunctions";
import {
  PostQuestionAnswersActions,
  PostQuestionAnswersState,
} from "./postQuestionAnswersTypes";

const postQuestionAnswersState: PostQuestionAnswersState = {
  questions: [],
  isLoadingQuestion: false,
  isLoadingAnswers: false,
};

const postQuestionAnswersReducer = (
  state: PostQuestionAnswersState = postQuestionAnswersState,
  action: PostQuestionAnswersActions
): PostQuestionAnswersState => {
  switch (action.type) {
    case "POPULATE_POST_QUESTIONS":
      return {
        ...state,
        questions: makeArrayOfObjectsUnique(
          [...state.questions, ...action.payload],
          "questionId"
        ),
      };

    case "ADD_POST_QUESTION":
      return {
        ...state,
        questions: [action.payload, ...state.questions],
      };

    case "POPULATE_POST_QUESTION_ANSWERS":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.questionId !== action.questionId) return { ...question };
          else
            return {
              ...question,
              answers: makeArrayOfObjectsUnique(
                [...question.answers, ...action.payload],
                "answerId"
              ),
            };
        }),
      };

    case "ADD_POST_QUESTION_ANSWER":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.questionId !== action.questionId) return { ...question };
          else
            return {
              ...question,
              answers: [action.payload, ...question.answers],
            };
        }),
      };

    case "SET_USERS_ANSWER__POST_QUESTION_ANSWERS":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.questionId !== action.questionId) return { ...question };
          return {
            ...question,
            usersAnswer: action.payload,
          };
        }),
      };

    case "SET_HAS_MORE__POST_QUESTION_ANSWERS":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.questionId !== action.questionId) return { ...question };
          else return { ...question, hasMoreAnswers: action.payload };
        }),
      };

    case "SET_IS_ANSWERED__POST_QUESTION_ANSWERS":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.questionId !== action.questionId) return { ...question };
          else return { ...question, isAnswered: action.payload };
        }),
      };

    case "SET_LAST_ANSWER_DOC_REF__POST_QUESTION_ANSWERS":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.questionId !== action.questionId) return { ...question };
          else return { ...question, lastAnswerDocRef: action.payload };
        }),
      };

    case "SET_LOADING_QUESTION__POST_QUESTION_ANSWERS":
      return {
        ...state,
        isLoadingQuestion: action.payload,
      };

    case "SET_LOADING_ANSWERS__POST_QUESTION_ANSWERS":
      return {
        ...state,
        isLoadingAnswers: action.payload,
      };

    case "HANDLE_ANSWER_LIKE__POST_QUESTION_ANSWERS":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.questionId !== action.questionId) return { ...question };
          else
            return {
              ...question,
              usersAnswer: !question.usersAnswer
                ? question.usersAnswer
                : question.usersAnswer?.answerId !== action.payload
                ? { ...question.usersAnswer }
                : {
                    ...question.usersAnswer,
                    isLiked: true,
                    likes: question.usersAnswer.likes + 1,
                  },

              answers: question.answers.map((answer) => {
                if (answer.answerId !== action.payload) return { ...answer };
                else
                  return {
                    ...answer,
                    isLiked: true,
                    likes: answer.likes + 1,
                  };
              }),
            };
        }),
      };

    case "HANDLE_ANSWER_UNLIKE__POST_QUESTION_ANSWERS":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.questionId !== action.questionId) return { ...question };
          else
            return {
              ...question,
              usersAnswer: !question.usersAnswer
                ? question.usersAnswer
                : question.usersAnswer?.answerId !== action.payload
                ? { ...question.usersAnswer }
                : {
                    ...question.usersAnswer,
                    isLiked: false,
                    likes: question.usersAnswer.likes - 1,
                  },
              answers: question.answers.map((answer) => {
                if (answer.answerId !== action.payload) return { ...answer };
                else
                  return {
                    ...answer,
                    isLiked: false,
                    likes: answer.likes - 1,
                  };
              }),
            };
        }),
      };

    case "SET_IS_ANSWER_PRIVATE__POST_QUESTION_ANSWERS":
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.questionId !== action.questionId) return { ...question };
          return {
            ...question,
            usersAnswer: question.usersAnswer && {
              ...question.usersAnswer,
              isPrivate: action.payload,
            },
          };
        }),
      };

    default:
      return { ...state };
  }
};

export default postQuestionAnswersReducer;
