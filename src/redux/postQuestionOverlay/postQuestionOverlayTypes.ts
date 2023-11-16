export const SET_IS_POST_QUESTION_OVERLAY_HIDDEN =
  "SET_IS_POST_QUESTION_OVERLAY_HIDDEN";
export const SET_POST_QUESTION_OVERLAY_ID = "SET_POST_QUESTION_OVERLAY_ID";

export interface PostQuestionOverlayState {
  questionId: string;
  isHidden: boolean;
}

export interface SetIsPostQuestionOverlayHidden {
  type: typeof SET_IS_POST_QUESTION_OVERLAY_HIDDEN;
  payload: boolean;
}

export interface SetPostQuestionOverlayId {
  type: typeof SET_POST_QUESTION_OVERLAY_ID;
  payload: string;
}

export type PostQuestionTypes =
  | SetIsPostQuestionOverlayHidden
  | SetPostQuestionOverlayId;
