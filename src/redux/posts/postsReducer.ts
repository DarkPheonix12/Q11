import { makeArrayOfObjectsUnique } from "../../helperFunctions";
import { PostsActionTypes, PostsState } from "./postsTypes";

const postsState: PostsState = {
  posts: [],
  loading: false,
  hasMore: true,
  lastPostDocRef: null,
};

const postsReducer = (
  state = postsState,
  action: PostsActionTypes
): PostsState => {
  switch (action.type) {
    case "POPULATE_POSTS":
      return {
        ...state,
        posts: makeArrayOfObjectsUnique(
          [...state.posts, ...action.payload],
          "id"
        ),
      };

    case "ADD_POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };

    case "LOADING_POSTS":
      return {
        ...state,
        loading: action.payload,
      };

    case "HAS_MORE_POSTS":
      return {
        ...state,
        hasMore: action.payload,
      };

    case "SET_LAST_POST_DOC_REF":
      return {
        ...state,
        lastPostDocRef: action.payload,
      };

    case "SET_POST_CONTENT":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.postId) return { ...post };
          return { ...post, content: action.payload };
        }),
      };

    default:
      return state;
  }
};

export default postsReducer;
