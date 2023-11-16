import { DocumentData } from "@google-cloud/firestore";

export const POPULATE_QUESTIONS = "POPULATE_QUESTIONS";
export const LOADING_QUESTIONS = "LOADING_QUESTIONS";
export const CHANGE_HAS_MORE_QUESTIONS = "CHANGE_HAS_MORE_QUESTIONS";
export const ADD_QUESTION = "ADD_QUESTION";
export const HANDLE_QUESTION_LIKE = "HANDLE_QUESTION_LIKE";
export const HANDLE_QUESTION_UNLIKE = "HANDLE_QUESTION_UNLIKE";
export const SET_LAST_QUESTION_DOC_REF = "SET_LAST_QUESTION_DOC_REF";
export const INCREMENT_QUESTION_SHARES = "INCREMENT_QUESTION_SHARES";

export interface QuestionsState {
  questions: Question[];
  loading: boolean;
  hasMore: boolean;
  lastQuestionDocRef: DocumentData | null;
}

export interface Question {
  id: string;
  createdBy: {
    name: string;
    username: string;
    profileAvatar: string;
    userId: string;
  };
  question: string;
  hashtags: string[];
  isLiked: boolean;
  likes: number;
  numberOfShares: number;
  createdAt: { seconds: number; nanoseconds: number } | number;
}

export interface PopulateQuestions {
  type: typeof POPULATE_QUESTIONS;
  payload: Question[];
}

export interface AddQuestion {
  type: typeof ADD_QUESTION;
  payload: Question;
}

export interface LoadingQuestions {
  type: typeof LOADING_QUESTIONS;
  payload: boolean;
}

export interface ChangeHasMoreQuestions {
  type: typeof CHANGE_HAS_MORE_QUESTIONS;
  payload: boolean;
}

export interface HandleQuestionLike {
  type: typeof HANDLE_QUESTION_LIKE;
  payload: string;
}

export interface HandleQuestionUnlike {
  type: typeof HANDLE_QUESTION_UNLIKE;
  payload: string;
}

export interface SetLastQuestionDocRef {
  type: typeof SET_LAST_QUESTION_DOC_REF;
  payload: DocumentData;
}

export interface IncrementQuestionShares {
  type: typeof INCREMENT_QUESTION_SHARES;
  payload: string;
}

export type Like = (likeData: {
  type: "question" | "answer" | "postQuestionAnswer";
  refId: string;
  postQuestionId?: string;
}) => Promise<boolean>;

export type Unlike = Like;

export type QuestionsActionTypes =
  | PopulateQuestions
  | LoadingQuestions
  | ChangeHasMoreQuestions
  | AddQuestion
  | HandleQuestionLike
  | HandleQuestionUnlike
  | SetLastQuestionDocRef
  | IncrementQuestionShares;
