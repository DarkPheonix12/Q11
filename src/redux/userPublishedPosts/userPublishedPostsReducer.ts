import {
  addObjectToArrayIfUnique,
  makeArrayOfObjectsUnique,
} from "../../helperFunctions";
import {
  PublishedPostsActionTypes,
  UserPublishedPostsState,
} from "./userPublishedPostsTypes";

const userPublishedPostsState: UserPublishedPostsState = {
  posts: [],
  loading: true,
  hasMore: true,
  lastPostDocRef: null,
};

const userPublishedPostsReducer = (
  state = userPublishedPostsState,
  action: PublishedPostsActionTypes
): UserPublishedPostsState => {
  switch (action.type) {
    case "POPULATE_PUBLISHED_POSTS":
      return {
        ...state,
        posts: makeArrayOfObjectsUnique(
          [...state.posts, ...action.payload],
          "id"
        ),
      };

    case "ADD_PUBLISHED_POST":
      return {
        ...state,
        posts: addObjectToArrayIfUnique([...state.posts], action.payload, "id"),
      };

    case "REMOVE_PUBLISHED_POST":
      return {
        ...state,
        posts: [...state.posts.filter((post) => post.id !== action.payload)],
      };

    case "LOADING_PUBLISHED_POSTS":
      return {
        ...state,
        loading: action.payload,
      };

    case "HAS_MORE_PUBLISHED_POSTS":
      return {
        ...state,
        hasMore: action.payload,
      };

    case "SET_LAST_PUBLISHED_POST_DOC_REF":
      return {
        ...state,
        lastPostDocRef: action.payload,
      };

    default:
      return state;
  }
};

export default userPublishedPostsReducer;
