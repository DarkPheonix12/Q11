import { DocumentData } from "@google-cloud/firestore";
import { Post } from "..";

export const POPULATE_PUBLISHED_POSTS = "POPULATE_PUBLISHED_POSTS";
export const ADD_PUBLISHED_POST = "ADD_PUBLISHED_POST";
export const REMOVE_PUBLISHED_POST = "REMOVE_PUBLISHED_POST";
export const LOADING_PUBLISHED_POSTS = "LOADING_PUBLISHED_POSTS";
export const HAS_MORE_PUBLISHED_POSTS = "HAS_MORE_PUBLISHED_POSTS";
export const SET_LAST_PUBLISHED_POST_DOC_REF =
  "SET_LAST_PUBLISHED_POST_DOC_REF";

export interface UserPublishedPostsState {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  lastPostDocRef: DocumentData | null;
}

export interface PopulatePublishedPosts {
  type: typeof POPULATE_PUBLISHED_POSTS;
  payload: Post[];
}

export interface AddPublishedPost {
  type: typeof ADD_PUBLISHED_POST;
  payload: Post;
}

export interface RemovePublishedPost {
  type: typeof REMOVE_PUBLISHED_POST;
  payload: string;
}

export interface LoadingPublishedPosts {
  type: typeof LOADING_PUBLISHED_POSTS;
  payload: boolean;
}

export interface HasMorePublishedPosts {
  type: typeof HAS_MORE_PUBLISHED_POSTS;
  payload: boolean;
}

export interface SetLastPublishedPostDocRef {
  type: typeof SET_LAST_PUBLISHED_POST_DOC_REF;
  payload: DocumentData;
}

export type PublishedPostsActionTypes =
  | PopulatePublishedPosts
  | AddPublishedPost
  | RemovePublishedPost
  | LoadingPublishedPosts
  | HasMorePublishedPosts
  | SetLastPublishedPostDocRef;
