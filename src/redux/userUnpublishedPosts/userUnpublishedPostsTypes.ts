import { DocumentData } from "@google-cloud/firestore";
import { Post } from "..";
import { PostTypes } from "../../schemas";

export const POPULATE_UNPUBLISHED_POSTS = "POPULATE_UNPUBLISHED_POSTS";
export const ADD_UNPUBLISHED_POST = "ADD_UNPUBLISHED_POST";
export const UPDATE_UNPUBLISHED_POST = "UPDATE_UNPUBLISHED_POST";
export const REMOVE_UNPUBLISHED_POST = "REMOVE_UNPUBLISHED_POST";
export const LOADING_UNPUBLISHED_POSTS = "LOADING_UNPUBLISHED_POSTS";
export const HAS_MORE_UNPUBLISHED_POSTS = "HAS_MORE_UNPUBLISHED_POSTS";
export const SET_LAST_UNPUBLISHED_POST_DOC_REF =
  "SET_LAST_UNPUBLISHED_POST_DOC_REF";

export interface UserUnpublishedPostsState {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  lastPostDocRef: DocumentData | null;
}

export interface UnpublishedPostUpdateData {
  type: PostTypes;
  img: string;
  hashtags: string[];
  genre: string[];
  description: string;
  title: string;
  contentSnippet: string;
  estimatedTimeToRead: number;
  content: string;
  updatedAt: number;
}

export interface PopulateUnpublishedPosts {
  type: typeof POPULATE_UNPUBLISHED_POSTS;
  payload: Post[];
}

export interface AddUnpublishedPost {
  type: typeof ADD_UNPUBLISHED_POST;
  payload: Post;
}

export interface UpdateUnpublishedPost {
  type: typeof UPDATE_UNPUBLISHED_POST;
  postId: string;
  payload: UnpublishedPostUpdateData;
}

export interface RemoveUnpublishedPost {
  type: typeof REMOVE_UNPUBLISHED_POST;
  payload: string;
}

export interface LoadingUnpublishedPosts {
  type: typeof LOADING_UNPUBLISHED_POSTS;
  payload: boolean;
}

export interface HasMoreUnpublishedPosts {
  type: typeof HAS_MORE_UNPUBLISHED_POSTS;
  payload: boolean;
}

export interface SetLastUnpublishedPostDocRef {
  type: typeof SET_LAST_UNPUBLISHED_POST_DOC_REF;
  payload: DocumentData;
}

export type UnpublishedPostsActionTypes =
  | PopulateUnpublishedPosts
  | AddUnpublishedPost
  | UpdateUnpublishedPost
  | RemoveUnpublishedPost
  | LoadingUnpublishedPosts
  | HasMoreUnpublishedPosts
  | SetLastUnpublishedPostDocRef;
