import { UserActivitySchema } from "../../schemas";

export const POPULATE_USER_ACTIVITY = "POPULATE_USER_ACTIVITY";
export const UPDATE_ANSWER_LIKES = "UPDATE_ANSWER_LIKES";
export const UPDATE_QUESTION_LIKES = "UPDATE_QUESTION_LIKES";
export const UPDATE_BOOKMARKS = "UPDATE_BOOKMARKS";
export const UPDATE_FOLLOWING = "UPDATE_FOLLOWING";
export const UPDATE_RATED_POSTS = "UPDATE_RATED_POSTS";
export const UPDATE_POST_QUESTION_ANSWER_LIKES =
  "UPDATE_POST_QUESTION_ANSWER_LIKES";

export interface UserActivityState extends UserActivitySchema {}

export interface PopulateUserActivity {
  type: typeof POPULATE_USER_ACTIVITY;
  payload: UserActivityState;
}

export interface UpdateAnswerLikes {
  type: typeof UPDATE_ANSWER_LIKES;
  payload: string;
}

export interface UpdateQuestionLikes {
  type: typeof UPDATE_QUESTION_LIKES;
  payload: string;
}
export interface UpdateBookmarks {
  type: typeof UPDATE_BOOKMARKS;
  payload: { postId: string; scrollPosition: number };
}
export interface UpdateFollowing {
  type: typeof UPDATE_FOLLOWING;
  payload: string;
}
export interface UpdateRatedPosts {
  type: typeof UPDATE_RATED_POSTS;
  payload: { postId: string; rating: number };
}

export interface UpdatePostQuestionAnswerLikes {
  type: typeof UPDATE_POST_QUESTION_ANSWER_LIKES;
  payload: string;
}

export type UserActivityActionTypes =
  | PopulateUserActivity
  | UpdateAnswerLikes
  | UpdateQuestionLikes
  | UpdateBookmarks
  | UpdateFollowing
  | UpdateRatedPosts
  | UpdatePostQuestionAnswerLikes;
