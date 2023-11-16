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
  AddPublishedPost,
  HasMorePublishedPosts,
  LoadingPublishedPosts,
  PopulatePublishedPosts,
  RemovePublishedPost,
  SetLastPublishedPostDocRef,
} from "./userPublishedPostsTypes";

export const populatePublishedPosts = (
  posts: Post[]
): PopulatePublishedPosts => ({
  type: "POPULATE_PUBLISHED_POSTS",
  payload: posts,
});

export const addPublishedPost = (post: Post): AddPublishedPost => ({
  type: "ADD_PUBLISHED_POST",
  payload: post,
});

export const removePublishedPost = (postId: string): RemovePublishedPost => ({
  type: "REMOVE_PUBLISHED_POST",
  payload: postId,
});

export const loadingPublishedPosts = (
  loading: boolean
): LoadingPublishedPosts => ({
  type: "LOADING_PUBLISHED_POSTS",
  payload: loading,
});

export const hasMorePublishedPosts = (
  hasMorePosts: boolean
): HasMorePublishedPosts => ({
  type: "HAS_MORE_PUBLISHED_POSTS",
  payload: hasMorePosts,
});

export const setLastPublishedPostDocRef = (
  lastDocRef: DocumentData
): SetLastPublishedPostDocRef => ({
  type: "SET_LAST_PUBLISHED_POST_DOC_REF",
  payload: lastDocRef,
});

export const getPublishedPosts =
  () =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    if (firebaseAuth.currentUser) {
      // If there are no more posts to load
      if (!getState().userPublishedPosts.hasMore) return false;

      dispatch(loadingPublishedPosts(true));
      const postsArray: Post[] = [];
      const postsRef = firestoreRef.collection("posts");
      const lastDoc = getState().userPublishedPosts.lastPostDocRef;
      const limit = getRequestLimitByWindowWidth("posts");
      let numOfDoc = 0;
      try {
        const qs = lastDoc // Query Snapshot depends on if lastDocRef is present
          ? await postsRef
              .orderBy("publishedAt", "desc")
              .where("createdBy.userId", "==", firebaseAuth.currentUser.uid)
              .where("isPublished", "==", true)
              .startAfter(lastDoc)
              .limit(limit)
              .get()
          : await postsRef
              .orderBy("publishedAt", "desc")
              .where("createdBy.userId", "==", firebaseAuth.currentUser.uid)
              .where("isPublished", "==", true)
              .limit(limit)
              .get();

        if (!qs.empty) {
          for (const doc of qs.docs) {
            numOfDoc++;
            if (numOfDoc === qs.docs.length)
              dispatch(setLastPublishedPostDocRef(doc));
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
            setNotification({
              text: getNotificationMessage("no-more-posts"),
            })
          );
          dispatch(hasMorePublishedPosts(false));
          dispatch(loadingPublishedPosts(false));
          return true;
        }
        if (postsArray.length > 0) dispatch(populatePublishedPosts(postsArray));
        if (postsArray.length < limit) {
          dispatch(
            setNotification({ text: getNotificationMessage("no-more-posts") })
          );
          dispatch(hasMorePublishedPosts(false));
        }
        dispatch(loadingPublishedPosts(false));
        return true;
      } catch (err) {
        dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
        dispatch(loadingPublishedPosts(false));
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
