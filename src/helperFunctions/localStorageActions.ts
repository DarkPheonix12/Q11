import { UserState } from "../redux";
import {
  LocalPostViewSettings,
  LocalTempPostData,
  LocalUnpublishedPostData,
} from "../types";

interface userActivity {
  followers?: string[];
  following?: string[];
  bookmarks?: { postId: string; scrollPosition: number }[];
  ratedPosts?: { postId: string; rating: number }[];
  questionLikes?: string[];
  answerLikes?: string[];
  postQuestionAnswerLikes?: string[];
}

export const updateLocalUserActivity = (updates: userActivity) => {
  const localUserActivity = localStorage.getItem("userActivity");
  const localUserActivityParsed =
    localUserActivity && JSON.parse(localUserActivity);

  const newUserActivity = { ...localUserActivityParsed, ...updates };
  localStorage.setItem("userActivity", JSON.stringify(newUserActivity));
};

export const updateLocalUserInfo = (updates: userActivity) => {
  const localUserInfo = localStorage.getItem("userInfo");
  const localUserInfoParsed = localUserInfo && JSON.parse(localUserInfo);

  const newUserInfo = { ...localUserInfoParsed, ...updates };
  localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
};

export const updateLocalUserSettings = (settingsUpdates: {
  allowNotifications?: boolean;
  replyNotifications?: boolean;
  profileVisibility?: "public" | "private";
  quriosity?: boolean;
  publishedCreationsVisibility?: boolean;
}) => {
  const localUserInfo = localStorage.getItem("userInfo");
  if (localUserInfo) {
    const localUserInfoParsed = JSON.parse(localUserInfo) as UserState;
    const localUserSettings = localUserInfoParsed.userSettings;

    const newUserInfo: UserState = {
      ...localUserInfoParsed,
      userSettings: { ...localUserSettings, ...settingsUpdates },
    };
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
  }
};

export const getLocalQuestionLikes = (): string[] | null => {
  const localUserActivity = localStorage.getItem("userActivity");
  if (localUserActivity) {
    const localUserActivityParsed = JSON.parse(localUserActivity);
    const questionLikes: string[] = localUserActivityParsed.questionLikes;
    return questionLikes;
  } else return null;
};

export const getLocalAnswerLikes = (): string[] | null => {
  const localUserActivity = localStorage.getItem("userActivity");
  if (localUserActivity) {
    const localUserActivityParsed =
      localUserActivity && JSON.parse(localUserActivity);
    const answerLikes: string[] = localUserActivityParsed.answerLikes;
    return answerLikes;
  } else return null;
};

export const getLocalPostQuestionAnswerLikes = (): string[] | null => {
  const localUserActivity = localStorage.getItem("userActivity");
  if (localUserActivity) {
    const localUserActivityParsed =
      localUserActivity && JSON.parse(localUserActivity);
    const answerLikes: string[] =
      localUserActivityParsed.postQuestionAnswerLikes;
    return answerLikes;
  } else return null;
};

export const getLocalBookmarks = ():
  | { postId: string; scrollPosition: number }[]
  | null => {
  const localUserActivity = localStorage.getItem("userActivity");
  if (localUserActivity) {
    const localUserActivityParsed =
      localUserActivity && JSON.parse(localUserActivity);
    const bookmarks: { postId: string; scrollPosition: number }[] =
      localUserActivityParsed.bookmarks;
    return bookmarks;
  } else return null;
};

export const getLocalFollowing = (): string[] | null => {
  const localUserActivity = localStorage.getItem("userActivity");
  if (localUserActivity) {
    const localUserActivityParsed =
      localUserActivity && JSON.parse(localUserActivity);
    const following: string[] = localUserActivityParsed.following;
    return following.length > 0 ? following : null;
  } else return null;
};

export const getLocalRatedPosts = ():
  | { postId: string; rating: number }[]
  | null => {
  const localUserActivity = localStorage.getItem("userActivity");
  if (localUserActivity) {
    const localUserActivityParsed =
      localUserActivity && JSON.parse(localUserActivity);
    const ratedPosts: { postId: string; rating: number }[] =
      localUserActivityParsed.ratedPosts;
    return ratedPosts;
  } else return null;
};

export const getLocalUserImage = (): string => {
  const localUser = localStorage.getItem("userInfo");
  if (localUser) {
    const localUserParsed = JSON.parse(localUser) as UserState;
    return localUserParsed.profileAvatar;
  } else return "";
};

export const checkIfFollowing = (userId: string): boolean => {
  const following = getLocalFollowing();

  if (following) return following.includes(userId) ? true : false;
  else return false;
};

export const getLocalPostViewSettings = <K extends keyof LocalPostViewSettings>(
  setting: K
): LocalPostViewSettings[K] | null => {
  const postViewSettings = localStorage.getItem("postViewSettings");
  if (!postViewSettings) return null;
  const postViewSettingsParsed = JSON.parse(
    postViewSettings
  ) as LocalPostViewSettings;
  return postViewSettingsParsed[setting] || null;
};

export const updateLocalPostViewSettings = <
  K extends keyof LocalPostViewSettings,
  T extends LocalPostViewSettings[K]
>(
  setting: K,
  value: T
): void => {
  const postViewSettings = localStorage.getItem("postViewSettings");
  if (postViewSettings) {
    const postViewSettingsParsed = JSON.parse(
      postViewSettings
    ) as LocalPostViewSettings;
    const newPostViewSettings: LocalPostViewSettings = {
      ...postViewSettingsParsed,
      [setting]: value,
    };
    localStorage.setItem(
      "postViewSettings",
      JSON.stringify(newPostViewSettings)
    );
    return;
  }
  localStorage.setItem(
    "postViewSettings",
    JSON.stringify({ [setting]: value })
  );
};
// tempPosts
export const getLocalTempPosts = () => {
  const tempPosts = localStorage.getItem("tempPosts");
  if (!tempPosts) return null;
  const tempPostsParsed = JSON.parse(tempPosts) as LocalTempPostData[];
  return tempPostsParsed || null;
};

export const getLocalTempPostByType = (postType: string) => {
  const tempPosts = getLocalTempPosts();
  if (!tempPosts) return null;
  return tempPosts.filter((post) => post.type === postType)[0] || null;
};

export const removeLocalTempPostByType = (postType: string) => {
  const tempPosts = getLocalTempPosts();
  if (!tempPosts) return null;
  return localStorage.setItem(
    "tempPosts",
    JSON.stringify(tempPosts.filter((post) => post.type !== postType))
  );
};

export const updateLocalTempPost = (postUpdateData: LocalTempPostData) => {
  const tempPosts = getLocalTempPosts();

  if (!tempPosts || tempPosts.length === 0) {
    return localStorage.setItem(
      "tempPosts",
      JSON.stringify([{ ...postUpdateData }])
    );
  }

  if (
    tempPosts.filter((p) => postUpdateData.type === p.type)[0] === undefined
  ) {
    return localStorage.setItem(
      "tempPosts",
      JSON.stringify([...tempPosts, postUpdateData])
    );
  }

  const updatedTempPosts = tempPosts.map((p) => {
    if (postUpdateData.type === p.type) return { ...p, ...postUpdateData };
    return p;
  });
  localStorage.setItem("tempPosts", JSON.stringify(updatedTempPosts));
};
// unpublishedPosts
export const getLocalUnpublishedPosts = () => {
  const unpublishedPosts = localStorage.getItem("unpublishedPosts");
  if (!unpublishedPosts) return null;
  const unpublishedPostsParsed = JSON.parse(
    unpublishedPosts
  ) as LocalUnpublishedPostData[];
  return unpublishedPostsParsed || null;
};

export const getLocalUnpublishedPostById = (postId: string) => {
  const unpublishedPosts = getLocalUnpublishedPosts();
  if (!unpublishedPosts) return null;
  return unpublishedPosts.filter((post) => post.id === postId)[0] || null;
};

export const removeLocalUnpublishedPostById = (postId: string) => {
  const unpublishedPosts = getLocalUnpublishedPosts();
  if (!unpublishedPosts) return null;
  console.log(postId);
  console.log(unpublishedPosts[0].id);
  console.log(unpublishedPosts.filter((post) => post.id !== postId));
  return localStorage.setItem(
    "unpublishedPosts",
    JSON.stringify(unpublishedPosts.filter((post) => post.id !== postId))
  );
};

export const updateLocalUnpublishedPost = (
  postUpdateData: LocalUnpublishedPostData
) => {
  const unpublishedPosts = getLocalUnpublishedPosts();

  if (!unpublishedPosts || unpublishedPosts.length === 0) {
    return localStorage.setItem(
      "unpublishedPosts",
      JSON.stringify([{ ...postUpdateData }])
    );
  }

  if (
    unpublishedPosts.filter((p) => postUpdateData.id === p.id)[0] === undefined
  ) {
    return localStorage.setItem(
      "unpublishedPosts",
      JSON.stringify([...unpublishedPosts, postUpdateData])
    );
  }

  const updatedTempPosts = unpublishedPosts.map((p) => {
    if (postUpdateData.id === p.id) return { ...p, ...postUpdateData };
    return p;
  });

  localStorage.setItem("unpublishedPosts", JSON.stringify(updatedTempPosts));
};
