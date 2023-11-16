import { DocumentData } from "@google-cloud/firestore";
import { Question } from "../questions/questionsTypes";

export const POPULATE_QURIOSITY_QUESTIONS = "POPULATE_QURIOSITY_QUESTIONS";
export const LOADING_QURIOSITY_QUESTIONS = "LOADING_QURIOSITY_QUESTIONS";
export const ADD_QURIOSITY_QUESTION = "ADD_QURIOSITY_QUESTION";
export const HANDLE_QURIOSITY_QUESTION_LIKE = "HANDLE_QURIOSITY_QUESTION_LIKE";
export const HANDLE_QURIOSITY_QUESTION_UNLIKE =
  "HANDLE_QURIOSITY_QUESTION_UNLIKE";
export const SET_LAST_QURIOSITY_QUESTION_DOC_REF =
  "SET_LAST_QURIOSITY_QUESTION_DOC_REF";
export const CHANGE_HAS_MORE_QURIOSITY_QUESTIONS =
  "CHANGE_HAS_MORE_QURIOSITY_QUESTIONS";

export interface QuriosityQuestionsState {
  questions: Question[];
  hasMore: boolean;
  loading: boolean;
  lastQuestionDocRef: DocumentData | null;
}

export interface PopulateQuriosityQuestions {
  type: typeof POPULATE_QURIOSITY_QUESTIONS;
  payload: Question[];
}

export interface AddQuriosityQuestion {
  type: typeof ADD_QURIOSITY_QUESTION;
  payload: Question;
}

export interface LoadingQuriosityQuestions {
  type: typeof LOADING_QURIOSITY_QUESTIONS;
  payload: boolean;
}

export interface HandleQuriosityQuestionLike {
  type: typeof HANDLE_QURIOSITY_QUESTION_LIKE;
  payload: string;
}

export interface HandleQuriosityQuestionUnlike {
  type: typeof HANDLE_QURIOSITY_QUESTION_UNLIKE;
  payload: string;
}

export interface SetLastQuriosityQuestionDocRef {
  type: typeof SET_LAST_QURIOSITY_QUESTION_DOC_REF;
  payload: DocumentData;
}

export interface ChangeHasMoreQuriosityQuestions {
  type: typeof CHANGE_HAS_MORE_QURIOSITY_QUESTIONS;
  payload: boolean;
}

export type QuriosityQuestionsActionTypes =
  | PopulateQuriosityQuestions
  | AddQuriosityQuestion
  | LoadingQuriosityQuestions
  | HandleQuriosityQuestionLike
  | HandleQuriosityQuestionUnlike
  | SetLastQuriosityQuestionDocRef
  | ChangeHasMoreQuriosityQuestions;
