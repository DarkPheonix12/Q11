import {
  SetIsPostQuestionOverlayHidden,
  SetPostQuestionOverlayId,
} from "./postQuestionOverlayTypes";

export const setIsPostQuestionOverlayHidden = (
  isHidden: boolean
): SetIsPostQuestionOverlayHidden => ({
  type: "SET_IS_POST_QUESTION_OVERLAY_HIDDEN",
  payload: isHidden,
});

export const setPostQuestionOverlayId = (
  questionId: string
): SetPostQuestionOverlayId => ({
  type: "SET_POST_QUESTION_OVERLAY_ID",
  payload: questionId,
});
