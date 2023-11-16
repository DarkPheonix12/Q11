import { combineReducers } from "redux";
import answersReducer from "./answers/answersReducer";
import appStateReducer from "./appState/appStateReducer";
import likedQuestionsReducer from "./likedQuestions/likedQuestionsReducer";
import notificationReducer from "./notifications/notificationReducer";
import postQuestionOverlayReducer from "./postQuestionOverlay/postQuestionOverlayReducer";
import postQuestionAnswersReducer from "./postQuestionAnswers/postQuestionAnswersReducer";
import postsReducer from "./posts/postsReducer";
import questionsReducer from "./questions/questionsReducer";
import quriosityQuestionsReducer from "./quriosityQuestions/quriosityQuestionsReducer";
import userReducer from "./user/userReducer";
import userActivityReducer from "./userActivity/userActivityReducer";
import userImpactsReducer from "./userImpacts/userImpactsReducer";
import userProfilesReducer from "./userProfiles/userProfilesReducer";
import userPublishedPostsReducer from "./userPublishedPosts/userPublishedPostsReducer";
import userUnpublishedPostsReducer from "./userUnpublishedPosts/userUnpublishedPostsReducer";

const appReducer = combineReducers({
  notifications: notificationReducer,
  user: userReducer,
  appState: appStateReducer,
  questions: questionsReducer,
  answers: answersReducer,
  userActivity: userActivityReducer,
  likedQuestions: likedQuestionsReducer,
  userImpacts: userImpactsReducer,
  quriosityQuestions: quriosityQuestionsReducer,
  userProfiles: userProfilesReducer,
  posts: postsReducer,
  userPublishedPosts: userPublishedPostsReducer,
  userUnpublishedPosts: userUnpublishedPostsReducer,
  postQuestionOverlay: postQuestionOverlayReducer,
  postQuestionAnswers: postQuestionAnswersReducer,
});

export const rootReducer = (state: any, action: any) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
