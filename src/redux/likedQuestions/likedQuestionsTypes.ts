import { Question } from "../questions/questionsTypes";

export const POPULATE_LIKED_QUESTIONS = "POPULATE_LIKED_QUESTIONS";
export const LOADING_LIKED_QUESTIONS = "LOADING_LIKED_QUESTIONS";
export const ADD_LIKED_QUESTION = "ADD_LIKED_QUESTION";
export const HANDLE_LIKED_QUESTION_LIKE = "HANDLE_LIKED_QUESTION_LIKE";
export const HANDLE_LIKED_QUESTION_UNLIKE = "HANDLE_LIKED_QUESTION_UNLIKE";
export const SET_LAST_LIKED_QUESTION_REF = "SET_LAST_LIKED_QUESTION_REF";
export const CHANGE_HAS_MORE_LIKED_QUESTIONS =
  "CHANGE_HAS_MORE_LIKED_QUESTIONS";

export interface LikedQuestionsState {
  questions: Question[];
  hasMore: boolean;
  loading: boolean;
  lastLikedQuestionRef: string;
}

export interface PopulateLikedQuestions {
  type: typeof POPULATE_LIKED_QUESTIONS;
  payload: Question[];
}

export interface AddLikedQuestion {
  type: typeof ADD_LIKED_QUESTION;
  payload: Question;
}

export interface LoadingLikedQuestions {
  type: typeof LOADING_LIKED_QUESTIONS;
  payload: boolean;
}

export interface HandleLikedQuestionLike {
  type: typeof HANDLE_LIKED_QUESTION_LIKE;
  payload: string;
}

export interface HandleLikedQuestionUnlike {
  type: typeof HANDLE_LIKED_QUESTION_UNLIKE;
  payload: string;
}

export interface SetLastLikedQuestionArrayRef {
  type: typeof SET_LAST_LIKED_QUESTION_REF;
  payload: string;
}

export interface ChangeHasMoreLikedQuestions {
  type: typeof CHANGE_HAS_MORE_LIKED_QUESTIONS;
  payload: boolean;
}

export type LikedQuestionsActionTypes =
  | PopulateLikedQuestions
  | AddLikedQuestion
  | LoadingLikedQuestions
  | HandleLikedQuestionLike
  | HandleLikedQuestionUnlike
  | SetLastLikedQuestionArrayRef
  | ChangeHasMoreLikedQuestions;
