import {
  UpdateAnswerLikes,
  UpdateBookmarks,
  UpdateFollowing,
  UpdateQuestionLikes,
  PopulateUserActivity,
  UserActivityState,
  UpdateRatedPosts,
  UpdatePostQuestionAnswerLikes,
} from "./userActivityTypes";

export const populateUserActivity = (
  payload: UserActivityState
): PopulateUserActivity => ({
  type: "POPULATE_USER_ACTIVITY",
  payload,
});

export const updateAnswerLikes = (payload: string): UpdateAnswerLikes => ({
  type: "UPDATE_ANSWER_LIKES",
  payload,
});

export const updatePostQuestionAnswerLikes = (
  payload: string
): UpdatePostQuestionAnswerLikes => ({
  type: "UPDATE_POST_QUESTION_ANSWER_LIKES",
  payload,
});

export const updateQuestionLikes = (payload: string): UpdateQuestionLikes => ({
  type: "UPDATE_QUESTION_LIKES",
  payload,
});

export const updateBookmarks = (payload: {
  postId: string;
  scrollPosition: number;
}): UpdateBookmarks => ({
  type: "UPDATE_BOOKMARKS",
  payload,
});

export const updateFollowing = (payload: string): UpdateFollowing => ({
  type: "UPDATE_FOLLOWING",
  payload,
});

export const updateRatedPosts = (payload: {
  postId: string;
  rating: number;
}): UpdateRatedPosts => ({
  type: "UPDATE_RATED_POSTS",
  payload,
});
