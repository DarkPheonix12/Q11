import { DocumentData } from "@google-cloud/firestore";

export const POPULATE_ANSWERS = "POPULATE_ANSWERS";
export const POPULATE_STATUS_OF_ANSWERS = "POPULATE_STATUS_OF_ANSWERS";
export const LOAD_MORE_ANSWERS = "LOAD_MORE_ANSWERS";
export const LOADING_ANSWERS = "LOADING_ANSWERS";
export const CHANGE_HAS_MORE_ANSWERS = "CHANGE_HAS_MORE_ANSWERS";
export const ADD_ANSWER = "ADD_ANSWER";
export const HANDLE_ANSWER_LIKE = "HANDLE_ANSWER_LIKE";
export const HANDLE_ANSWER_UNLIKE = "HANDLE_ANSWER_UNLIKE";
export const SET_LAST_ANSWER_DOC_REF = "SET_LAST_ANSWER_DOC_REF";
export const CHANGE_HAS_ANSWERED = "CHANGE_HAS_ANSWERED";

export interface AnswersState {
  answers: Answer[];
  loading: boolean;
  statusOfAnswers: StatusOfAnswers[];
}

export interface Answer {
  id: string;
  questionId: string;
  createdBy: {
    userId: string;
    name: string;
    username: string;
    profileAvatar: string;
  };
  answer: string;
  isLiked: boolean;
  likes: number;
  createdAt: { seconds: number; nanoseconds: number } | number;
}

export interface StatusOfAnswers {
  questionId: string;
  lastDocRef: DocumentData | null;
  hasMore: boolean;
  hasAnswered: boolean;
}

export interface PopulateAnswers {
  type: typeof POPULATE_ANSWERS;
  payload: Answer[];
  questionId: string;
}

export interface LoadingAnswers {
  type: typeof LOADING_ANSWERS;
  payload: boolean;
}

export interface SetLastAnswerDocRef {
  type: typeof SET_LAST_ANSWER_DOC_REF;
  payload: DocumentData;
  questionId: string;
}

export interface HandleAnswerLike {
  type: typeof HANDLE_ANSWER_LIKE;
  payload: string;
}

export interface HandleAnswerUnlike {
  type: typeof HANDLE_ANSWER_UNLIKE;
  payload: string;
}

export interface ChangeHasMoreAnswers {
  type: typeof CHANGE_HAS_MORE_ANSWERS;
  payload: boolean;
  questionId: string;
}

export interface PopulateStatusOfAnswers {
  type: typeof POPULATE_STATUS_OF_ANSWERS;
  payload: StatusOfAnswers;
}

export interface AddAnswer {
  type: typeof ADD_ANSWER;
  payload: Answer;
}

export interface ChangeHasAnswered {
  type: typeof CHANGE_HAS_ANSWERED;
  payload: boolean;
  questionId: string;
}

export type AnswerActionTypes =
  | PopulateAnswers
  | LoadingAnswers
  | SetLastAnswerDocRef
  | HandleAnswerLike
  | HandleAnswerUnlike
  | ChangeHasMoreAnswers
  | PopulateStatusOfAnswers
  | AddAnswer
  | ChangeHasAnswered;
