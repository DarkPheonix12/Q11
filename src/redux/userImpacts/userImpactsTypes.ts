import { DocumentData } from "@google-cloud/firestore";
import { Answer } from "../answers/answersTypes";
import { Question } from "../questions/questionsTypes";

export const POPULATE_USER_IMAPCTS = "POPULATE_USER_IMAPCTS";
export const POPULATE_USER_IMAPCTS_QUESTIONS =
  "POPULATE_USER_IMAPCTS_QUESTIONS";
export const LOADING_USER_IMAPCTS = "LOADING_USER_IMAPCTS";
export const CHANGE_HAS_MORE_USER_IMAPCTS = "CHANGE_HAS_MORE_USER_IMAPCTS";
export const ADD_USER_IMPACT = "ADD_USER_IMPACT";
export const ADD_USER_IMPACT_QUESTION = "ADD_USER_IMPACT_QUESTION";
export const HANDLE_USER_IMPACT_LIKE = "HANDLE_USER_IMPACT_LIKE";
export const HANDLE_USER_IMPACT_UNLIKE = "HANDLE_USER_IMPACT_UNLIKE";
export const SET_LAST_USER_IMPACT_DOC_REF = "SET_LAST_USER_IMPACT_DOC_REF";

export interface UserImapctsState {
  questions: Question[];
  answers: Answer[];
  loading: boolean;
  hasMore: boolean;
  lastImpactDocRef: DocumentData | null;
}

export interface PopulateUserImpacts {
  type: typeof POPULATE_USER_IMAPCTS;
  payload: Answer[];
}

export interface PopulateUserImpactsQuestions {
  type: typeof POPULATE_USER_IMAPCTS_QUESTIONS;
  payload: Question[];
}

export interface AddUserImpact {
  type: typeof ADD_USER_IMPACT;
  payload: Answer;
}

export interface AddUserImpactQuestion {
  type: typeof ADD_USER_IMPACT_QUESTION;
  payload: Question;
}

export interface LoadingUserImpacts {
  type: typeof LOADING_USER_IMAPCTS;
  payload: boolean;
}

export interface ChangeHasMoreUserImpacts {
  type: typeof CHANGE_HAS_MORE_USER_IMAPCTS;
  payload: boolean;
}

export interface HandleUserImpactLike {
  type: typeof HANDLE_USER_IMPACT_LIKE;
  payload: string;
}

export interface HandleUserImpactUnlike {
  type: typeof HANDLE_USER_IMPACT_UNLIKE;
  payload: string;
}

export interface SetLastUserImpactDocRef {
  type: typeof SET_LAST_USER_IMPACT_DOC_REF;
  payload: DocumentData;
}

export type UserImpactsActionTypes =
  | PopulateUserImpacts
  | PopulateUserImpactsQuestions
  | AddUserImpact
  | AddUserImpactQuestion
  | LoadingUserImpacts
  | ChangeHasMoreUserImpacts
  | HandleUserImpactLike
  | HandleUserImpactUnlike
  | SetLastUserImpactDocRef;
