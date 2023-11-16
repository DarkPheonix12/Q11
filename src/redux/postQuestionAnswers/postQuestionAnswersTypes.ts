import { DocumentData } from "@google-cloud/firestore";
import { PostQuestionAnswerSchemaRes } from "../../responseSchemas";
import { PostQuestionSchema } from "../../schemas";

const POPULATE_POST_QUESTIONS = "POPULATE_POST_QUESTIONS";
const POPULATE_POST_QUESTION_ANSWERS = "POPULATE_POST_QUESTION_ANSWERS";
const ADD_POST_QUESTION = "ADD_POST_QUESTION";
const ADD_POST_QUESTION_ANSWER = "ADD_POST_QUESTION_ANSWER";
const SET_LOADING_QUESTION__POST_QUESTION_ANSWERS =
  "SET_LOADING_QUESTION__POST_QUESTION_ANSWERS";
const SET_USERS_ANSWER__POST_QUESTION_ANSWERS =
  "SET_USERS_ANSWER__POST_QUESTION_ANSWERS";
const SET_LOADING_ANSWERS__POST_QUESTION_ANSWERS =
  "SET_LOADING_ANSWERS__POST_QUESTION_ANSWERS";
const SET_LAST_ANSWER_DOC_REF__POST_QUESTION_ANSWERS =
  "SET_LAST_ANSWER_DOC_REF__POST_QUESTION_ANSWERS";
const SET_IS_ANSWERED__POST_QUESTION_ANSWERS =
  "SET_IS_ANSWERED__POST_QUESTION_ANSWERS";
const SET_HAS_MORE__POST_QUESTION_ANSWERS =
  "SET_HAS_MORE__POST_QUESTION_ANSWERS";
const HANDLE_ANSWER_LIKE__POST_QUESTION_ANSWERS =
  "HANDLE_ANSWER_LIKE__POST_QUESTION_ANSWERS";
const HANDLE_ANSWER_UNLIKE__POST_QUESTION_ANSWERS =
  "HANDLE_ANSWER_UNLIKE__POST_QUESTION_ANSWERS";
const SET_IS_ANSWER_PRIVATE__POST_QUESTION_ANSWERS =
  "SET_IS_ANSWER_PRIVATE__POST_QUESTION_ANSWERS";

export interface PostQuestionAnswersState {
  questions: PostQuestion[];
  isLoadingQuestion: boolean;
  isLoadingAnswers: boolean;
}

export interface PostQuestion extends PostQuestionSchema {
  questionId: string;
  hasMoreAnswers: boolean;
  usersAnswer?: PostQuestionAnswer | null; // undefined = not checked yet | null = checked, not answered
  lastAnswerDocRef: DocumentData | null;
  answers: PostQuestionAnswer[];
  createdBy: { userId: string };
}

export interface PostQuestionAnswer extends PostQuestionAnswerSchemaRes {
  answerId: string;
  isLiked: boolean;
}

export interface PopulatePostQuestions {
  type: typeof POPULATE_POST_QUESTIONS;
  payload: PostQuestion[];
}

export interface AddPostQuestion {
  type: typeof ADD_POST_QUESTION;
  payload: PostQuestion;
}

export interface PopulatePostQuestionAnswers {
  type: typeof POPULATE_POST_QUESTION_ANSWERS;
  payload: PostQuestionAnswer[];
  questionId: string;
}

export interface AddPostQuestionAnswer {
  type: typeof ADD_POST_QUESTION_ANSWER;
  payload: PostQuestionAnswer;
  questionId: string;
}

export interface SetUsersAnswer {
  type: typeof SET_USERS_ANSWER__POST_QUESTION_ANSWERS;
  payload: PostQuestionAnswer | null;
  questionId: string;
}

export interface SetLoadingQuestion {
  type: typeof SET_LOADING_QUESTION__POST_QUESTION_ANSWERS;
  payload: boolean;
}

export interface SetLoadingAnswers {
  type: typeof SET_LOADING_ANSWERS__POST_QUESTION_ANSWERS;
  payload: boolean;
}

export interface SetLastAnswerDocRef {
  type: typeof SET_LAST_ANSWER_DOC_REF__POST_QUESTION_ANSWERS;
  payload: DocumentData;
  questionId: string;
}

export interface SetIsAnswered {
  type: typeof SET_IS_ANSWERED__POST_QUESTION_ANSWERS;
  payload: boolean;
  questionId: string;
}

export interface SetHasMore {
  type: typeof SET_HAS_MORE__POST_QUESTION_ANSWERS;
  payload: boolean;
  questionId: string;
}

export interface HandleAnswerLikePostQuestionAnswers {
  type: typeof HANDLE_ANSWER_LIKE__POST_QUESTION_ANSWERS;
  payload: string;
  questionId: string;
}

export interface HandleAnswerUnlikePostQuestionAnswers {
  type: typeof HANDLE_ANSWER_UNLIKE__POST_QUESTION_ANSWERS;
  payload: string;
  questionId: string;
}

export interface SetIsAnswerPrivate {
  type: typeof SET_IS_ANSWER_PRIVATE__POST_QUESTION_ANSWERS;
  payload: boolean;
  questionId: string;
}

export interface SubmitPostQuestionAnswerData {
  postId: string;
  questionId: string;
  answerData: {
    text: string;
    isPrivate: boolean;
  };
}

export type SubmitPostQuestionAnswer = (
  postQuestionAnswerData: SubmitPostQuestionAnswerData
) => Promise<boolean>;

export type PostQuestionAnswersActions =
  | PopulatePostQuestions
  | PopulatePostQuestionAnswers
  | AddPostQuestionAnswer
  | AddPostQuestion
  | SetUsersAnswer
  | SetLoadingQuestion
  | SetLoadingAnswers
  | SetLastAnswerDocRef
  | SetIsAnswered
  | SetHasMore
  | SetIsAnswerPrivate
  | HandleAnswerLikePostQuestionAnswers
  | HandleAnswerUnlikePostQuestionAnswers;
