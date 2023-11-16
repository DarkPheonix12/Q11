import { DocumentData } from "@google-cloud/firestore";
import { Dispatch } from "redux";
import { Post, setNotification } from "..";
import { firebaseAuth, firestoreRef } from "../../firebase";
import { getRequestLimitByWindowWidth } from "../../helperFunctions";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";
import { getUserAvatarUrlById } from "../../helperFunctions/firebaseUserActions";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import { PostSchemaRes } from "../../responseSchemas";
import { RootState } from "../rootReducer";
import {
  AddUnpublishedPost,
  HasMoreUnpublishedPosts,
  LoadingUnpublishedPosts,
  PopulateUnpublishedPosts,
  RemoveUnpublishedPost,
  SetLastUnpublishedPostDocRef,
  UnpublishedPostUpdateData,
  UpdateUnpublishedPost,
} from "./userUnpublishedPostsTypes";

export const populateUnpublishedPosts = (
  posts: Post[]
): PopulateUnpublishedPosts => ({
  type: "POPULATE_UNPUBLISHED_POSTS",
  payload: posts,
});

export const addUnpublishedPost = (post: Post): AddUnpublishedPost => ({
  type: "ADD_UNPUBLISHED_POST",
  payload: post,
});

export const updateUnpublishedPost = (
  postId: string,
  updateData: UnpublishedPostUpdateData
): UpdateUnpublishedPost => ({
  type: "UPDATE_UNPUBLISHED_POST",
  payload: updateData,
  postId,
});

export const removeUnpublishedPost = (
  postId: string
): RemoveUnpublishedPost => ({
  type: "REMOVE_UNPUBLISHED_POST",
  payload: postId,
});

export const loadingUnpublishedPosts = (
  loading: boolean
): LoadingUnpublishedPosts => ({
  type: "LOADING_UNPUBLISHED_POSTS",
  payload: loading,
});

export const hasMoreUnpublishedPosts = (
  hasMorePosts: boolean
): HasMoreUnpublishedPosts => ({
  type: "HAS_MORE_UNPUBLISHED_POSTS",
  payload: hasMorePosts,
});

export const setLastUnpublishedPostDocRef = (
  lastDocRef: DocumentData
): SetLastUnpublishedPostDocRef => ({
  type: "SET_LAST_UNPUBLISHED_POST_DOC_REF",
  payload: lastDocRef,
});

export const getUnpublishedPosts =
  () =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    if (firebaseAuth.currentUser) {
      // If there are no more posts to load
      if (!getState().userUnpublishedPosts.hasMore) return false;

      dispatch(loadingUnpublishedPosts(true));
      const postsArray: Post[] = [];
      const postsRef = firestoreRef.collection("posts");
      const lastDoc = getState().userUnpublishedPosts.lastPostDocRef;
      const limit = getRequestLimitByWindowWidth("posts");
      let numOfDoc = 0;
      try {
        const qs = lastDoc // Query Snapshot depends on if lastDocRef is present
          ? await postsRef
              .orderBy("updatedAt", "desc")
              .where("createdBy.userId", "==", firebaseAuth.currentUser.uid)
              .where("isPublished", "==", false)
              .startAfter(lastDoc)
              .limit(limit)
              .get()
          : await postsRef
              .orderBy("updatedAt", "desc")
              .where("createdBy.userId", "==", firebaseAuth.currentUser.uid)
              .where("isPublished", "==", false)
              .limit(limit)
              .get();

        if (!qs.empty) {
          for (const doc of qs.docs) {
            numOfDoc++;
            if (numOfDoc === qs.docs.length)
              dispatch(setLastUnpublishedPostDocRef(doc));
            const post = doc.data() as PostSchemaRes;
            const postId = doc.id;
            // const isBookmarked = await checkIfUserBookmarked(postId, "post");
            const postProfileAvatar = await getUserAvatarUrlById(
              post.createdBy.userId
            );

            const postForState: Post = {
              ...post,
              content: "",
              id: postId,
              isBookmarked: true,
              createdBy: {
                ...post.createdBy,
                userAvatar: postProfileAvatar,
              },
            };
            postsArray.push(postForState);
          }
        } else {
          // If empty hasMore = false and send back a notification
          dispatch(
            setNotification({ text: getNotificationMessage("no-more-posts") })
          );
          dispatch(hasMoreUnpublishedPosts(false));
          dispatch(loadingUnpublishedPosts(false));
          return true;
        }
        if (postsArray.length > 0)
          dispatch(populateUnpublishedPosts(postsArray));
        if (postsArray.length < limit) {
          dispatch(
            setNotification({ text: getNotificationMessage("no-more-posts") })
          );
          dispatch(hasMoreUnpublishedPosts(false));
        }
        dispatch(loadingUnpublishedPosts(false));
        return true;
      } catch (err) {
        dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
        dispatch(loadingUnpublishedPosts(false));
        console.error(err);
        return false;
      }
    } else {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      return false;
    }
  };
