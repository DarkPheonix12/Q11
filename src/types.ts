import { Timestamp } from "@google-cloud/firestore";
import { PostTypes } from "./schemas";

// I = Interface, R = Replacement Object with all the properties that need to be replaced
export type ModifyInterface<I, R> = Omit<I, keyof R> & R;
// Used for getting parameters for dobounce/throttle functions
export type Procedure = (...args: any[]) => any;

export interface cardInfo {
  type: "story" | "book" | "blog" | "poem" | "journal";
  postId: string;
  title: string;
  text: string;
  rating: number[];
  views: number;
  imgSrc?: string;
  publisherAvatar: string;
  // publisherId: string;
  private?: boolean;
  dateCreated?: { seconds: number; nanoseconds: number };
  dateUpdated?: { seconds: number; nanoseconds: number };
  minutesRead?: number;
  minutesToRead?: number;
  isBookmarked?: boolean;
  totalPages?: number;
  pagesRead?: number;
}

export interface recentActivityHeaderItem {
  publisherAvatar: string;
  postId?: string;
  questionId?: string;
}

export interface HeaderTag {
  tag: string;
  primary?: boolean;
  link?: string;
}

export interface AdInfo {
  type: "ad";
  adText: string;
  adId: string;
  adLink: string;
}

export interface Question {
  questionId: string;
  // creatorId: string;
  questionText: string;

  hashtags?: string[];
  likes: number;
}

export interface Answer {
  questionId: string;
  answerId: string;
  answerText: string;
}

export interface LocalPostViewSettings {
  postBackgroundColor: "yellow" | "gray" | "dark" | null;
  fontSize:
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25;
}

export interface LocalTempPostData {
  type: PostTypes;
  hashtags?: string[];
  genre?: string[];
  description?: string;
  content?: string;
  title?: string;
}

export interface LocalUnpublishedPostData extends LocalTempPostData {
  id: string;
  updatedAt?: number | Timestamp;
}
