import {
  PostQuestionTypes,
  PostQuestionOverlayState,
} from "./postQuestionOverlayTypes";

const postQuestionOverlayState: PostQuestionOverlayState = {
  questionId: "",
  isHidden: true,
};

const postQuestionOverlayReducer = (
  state = postQuestionOverlayState,
  action: PostQuestionTypes
): PostQuestionOverlayState => {
  switch (action.type) {
    case "SET_IS_POST_QUESTION_OVERLAY_HIDDEN":
      return {
        ...state,
        isHidden: action.payload,
      };

    case "SET_POST_QUESTION_OVERLAY_ID":
      return {
        ...state,
        questionId: action.payload,
      };

    default:
      return state;
  }
};

export default postQuestionOverlayReducer;
