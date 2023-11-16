import {
  UserActivityState,
  UserActivityActionTypes,
} from "./userActivityTypes";

const userActivityState: UserActivityState = {
  answerLikes: [],
  bookmarks: [],
  following: [],
  questionLikes: [],
  ratedPosts: [],
  postQuestionAnswerLikes: [],
};

const userActivityReducer = (
  state = userActivityState,
  action: UserActivityActionTypes
): UserActivityState => {
  switch (action.type) {
    case "POPULATE_USER_ACTIVITY":
      const {
        answerLikes,
        bookmarks,
        following,
        questionLikes,
        ratedPosts,
        postQuestionAnswerLikes,
      } = action.payload;
      return {
        ...state,
        answerLikes: answerLikes || [],
        bookmarks: bookmarks || [],
        following: following || [],
        questionLikes: questionLikes || [],
        ratedPosts: ratedPosts || [],
        postQuestionAnswerLikes: postQuestionAnswerLikes || [],
      };

    case "UPDATE_ANSWER_LIKES":
      return {
        ...state,
        answerLikes: state.answerLikes.includes(action.payload)
          ? state.answerLikes.filter((like) => like !== action.payload)
          : [...state.answerLikes, action.payload],
      };

    case "UPDATE_BOOKMARKS":
      return { ...state, bookmarks: [...state.bookmarks, action.payload] };

    case "UPDATE_FOLLOWING":
      return {
        ...state,
        following: state.following.includes(action.payload)
          ? state.following.filter((follow) => follow !== action.payload)
          : [...state.following, action.payload],
      };

    case "UPDATE_QUESTION_LIKES":
      return {
        ...state,
        questionLikes: state.questionLikes.includes(action.payload)
          ? state.questionLikes.filter((like) => like !== action.payload)
          : [...state.questionLikes, action.payload],
      };

    case "UPDATE_RATED_POSTS":
      return { ...state, ratedPosts: [...state.ratedPosts, action.payload] };

    case "UPDATE_POST_QUESTION_ANSWER_LIKES":
      return {
        ...state,
        postQuestionAnswerLikes: state.postQuestionAnswerLikes.includes(
          action.payload
        )
          ? state.postQuestionAnswerLikes.filter(
              (like) => like !== action.payload
            )
          : [...state.postQuestionAnswerLikes, action.payload],
      };

    default:
      return state;
  }
};

export default userActivityReducer;
