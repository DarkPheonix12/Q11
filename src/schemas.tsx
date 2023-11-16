import { FieldValue } from "@google-cloud/firestore";

export type RecentActivitySchema =
  | {
      type: "published";
      id: string;
      createdAt: number; // Date.now() because firebase doesn't support serverTimestamp in arrays
      estimatedTimeToRead: number;
      title: string;
      summary: string;
    }
  | {
      id: string;
      type: "asked";
      title: string;
      createdAt: number; // Date.now() because firebase doesn't support serverTimestamp in arrays
    }
  | {
      id: string;
      type: "rated";
      title: string;
      rating: number;
      createdAt: number; // Date.now() because firebase doesn't support serverTimestamp in arrays
      createdBy: { username: string; userId: string };
    };

export interface UserSchema {
  name: string;
  username: string;
  email: string;
  profileAvatar: string;
  userSettings: {
    allowNotifications: boolean;
    replyNotifications: boolean;
    profileVisibility: "public" | "private";
    quriosity: boolean;
    publishedCreationsVisibility: boolean;
  };
  following: number;
  followers: number;
  minutesRead: number;
  totalTimeOfAllPosts: number;
  numberOfPublishedPosts: number;
  profileViews: number;
  numberOfImpacts: number;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  recentActivity: RecentActivitySchema[]; // should contain only 0-3 elements
}

export type PostTypes = "story" | "book" | "blog" | "poem" | "journal";

export interface PostSchema {
  createdBy: {
    userId: string;
  };
  type: PostTypes;
  author: string;
  title: string;
  img: string;
  contentSnippet: string;
  description: string;
  views: number;
  hashtags: string[];
  genre: string[];
  isPublished: boolean;
  publishedAt: FieldValue | null; // server timestamp
  isPrivate: boolean;
  averageRating: number; // (newRating + (AverageRating * numberOfRatings)) / (numberOfRatings + 1)
  numberOfRatings: number;
  numberOfShares: number;
  numberOfBookmarks: number;
  estimatedTimeToRead: number;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface PostQuestionSchema {
  text: string;
  createdBy: { userId: string };
}

export interface PostQuestionAnswerSchema {
  postId: string;
  questionId: string;
  text: string;
  createdBy: {
    userId: string;
    username: string;
    userFullName: string;
  };
  createdAt: FieldValue;
  updatedAt: FieldValue;
  isPrivate: boolean;
  likes: number;
}

export interface QuestionSchema {
  createdBy: {
    userId: string;
    name: string;
    username: string;
  };
  question: string;
  hashtags: string[];
  likes: number;
  numberOfShares: number;
  createdAt: FieldValue; // server timestamp
}

export interface AnswerSchema {
  createdBy: {
    userId: string;
    name: string;
    username: string;
  };
  answer: string;
  likes: number;
  questionId: string;
  createdAt: FieldValue; // server timestamp
}

export interface UserActivitySchema {
  // id of the doucment should be the userId
  following: string[];
  bookmarks: { postId: string; scrollPosition: number }[];
  ratedPosts: { postId: string; rating: number }[];
  questionLikes: string[];
  answerLikes: string[];
  postQuestionAnswerLikes: string[];
}

export interface FollowingSchema {
  followedUserId: string;
  followerUserId: string;
  createdAt: FieldValue; // server timestamp
}

export interface PostRatingsSchema {
  postId: string;
  userId: string;
  rating: number;
  createdAt: FieldValue; // server timestamp
  updatedAt: FieldValue; // server timestamp
}

export interface ReportSchema {
  createdBy: {
    userId: string;
    username: string;
  };
  reportTypeId: "questions" | "answers" | "comments" | "profile";
  refId: string;
  inappropriate: boolean;
  hateSpeech: boolean;
  sexual: boolean;
  spam: boolean;
  violence: boolean;
  notLike: boolean;
  intellectualProperty: boolean;
  note: string;
  reportStatus: "pending" | "resolved";
  createdAt: FieldValue; // server timestamp
}
