import { DocumentData } from "@google-cloud/firestore";
import { PostSchemaRes } from "../../responseSchemas";
import { PostTypes } from "../../schemas";

const POPULATE_POSTS = "POPULATE_POSTS";
const ADD_POST = "ADD_POST";
const LOADING_POSTS = "LOADING_POSTS";
const HAS_MORE_POSTS = "HAS_MORE_POSTS";
const SET_LAST_POST_DOC_REF = "SET_LAST_POST_DOC_REF";
const SET_POST_CONTENT = "SET_POST_CONTENT";

export interface Post extends PostSchemaRes {
  id: string;
  isBookmarked: boolean;
  content: string;
  createdBy: {
    userId: string;
    userAvatar: string;
  };
}

export interface PostsState {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  lastPostDocRef: DocumentData | null;
}

export interface CreateNewPostData {
  description: string;
  content: string;
  title: string;
  type: PostTypes;
  genre: string[];
  hashtags: string[];
}

export interface PublishPostData extends CreateNewPostData {}

export interface PopulatePosts {
  type: typeof POPULATE_POSTS;
  payload: Post[];
}

export interface AddPost {
  type: typeof ADD_POST;
  payload: Post;
}

export interface LoadingPosts {
  type: typeof LOADING_POSTS;
  payload: boolean;
}

export interface HasMorePosts {
  type: typeof HAS_MORE_POSTS;
  payload: boolean;
}

export interface SetLastPostDocRef {
  type: typeof SET_LAST_POST_DOC_REF;
  payload: DocumentData;
}

export interface SetPostContent {
  type: typeof SET_POST_CONTENT;
  postId: string;
  payload: string;
}

export type PostsActionTypes =
  | PopulatePosts
  | AddPost
  | LoadingPosts
  | HasMorePosts
  | SetLastPostDocRef
  | SetPostContent;
