import {
  addObjectToArrayIfUnique,
  makeArrayOfObjectsUnique,
} from "../../helperFunctions";
import {
  UnpublishedPostsActionTypes,
  UserUnpublishedPostsState,
} from "./userUnpublishedPostsTypes";

const userUnpublishedPostsState: UserUnpublishedPostsState = {
  posts: [],
  loading: true,
  hasMore: true,
  lastPostDocRef: null,
};

const userUnpublishedPostsReducer = (
  state = userUnpublishedPostsState,
  action: UnpublishedPostsActionTypes
): UserUnpublishedPostsState => {
  switch (action.type) {
    case "POPULATE_UNPUBLISHED_POSTS":
      return {
        ...state,
        posts: makeArrayOfObjectsUnique(
          [...state.posts, ...action.payload],
          "id"
        ),
      };

    case "ADD_UNPUBLISHED_POST":
      return {
        ...state,
        posts: addObjectToArrayIfUnique([...state.posts], action.payload, "id"),
      };

    case "UPDATE_UNPUBLISHED_POST":
      return {
        ...state,
        posts: [
          ...state.posts.map((post) => {
            if (post.id === action.postId)
              return { ...post, ...action.payload };
            return { ...post };
          }),
        ],
      };

    case "REMOVE_UNPUBLISHED_POST":
      return {
        ...state,
        posts: [...state.posts.filter((post) => post.id !== action.payload)],
      };

    case "LOADING_UNPUBLISHED_POSTS":
      return {
        ...state,
        loading: action.payload,
      };

    case "HAS_MORE_UNPUBLISHED_POSTS":
      return {
        ...state,
        hasMore: action.payload,
      };

    case "SET_LAST_UNPUBLISHED_POST_DOC_REF":
      return {
        ...state,
        lastPostDocRef: action.payload,
      };

    default:
      return state;
  }
};

export default userUnpublishedPostsReducer;
