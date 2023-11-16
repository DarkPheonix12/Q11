import { DocumentData } from "@google-cloud/firestore";
import { Dispatch } from "redux";
import {
  addUnpublishedPost,
  setRequestActive,
  setNotification,
  setSavingToCloud,
  UnpublishedPostUpdateData,
} from "..";
import firebase, { firebaseAuth, firestoreRef } from "../../firebase";
import {
  getRequestLimitByWindowWidth,
  getTextFromHTML,
  sanitizePostContent,
  shortenText,
  splitStringByByteSize,
  trimStringArray,
} from "../../helperFunctions";
import { getNotificationMessage } from "../../helperFunctions/customNotificationMessages";
import { getUserAvatarUrlById } from "../../helperFunctions/firebaseUserActions";
import { customFirebaseErrorMessage } from "../../helperFunctions/firestoreErrorHandler";
import {
  removeLocalTempPostByType,
  removeLocalUnpublishedPostById,
} from "../../helperFunctions/localStorageActions";
import { PostSchemaRes } from "../../responseSchemas";
import { PostQuestionSchema, PostSchema, UserSchema } from "../../schemas";
import { RootState } from "../rootReducer";
import { addPublishedPost } from "../userPublishedPosts/userPublishedPostsActions";
import {
  removeUnpublishedPost,
  updateUnpublishedPost,
} from "../userUnpublishedPosts/userUnpublishedPostsActions";
import {
  AddPost,
  CreateNewPostData,
  HasMorePosts,
  LoadingPosts,
  PopulatePosts,
  Post,
  PublishPostData,
  SetLastPostDocRef,
  SetPostContent,
} from "./postsTypes";

export const populatePosts = (posts: Post[]): PopulatePosts => ({
  type: "POPULATE_POSTS",
  payload: posts,
});

export const addPost = (post: Post): AddPost => ({
  type: "ADD_POST",
  payload: post,
});

export const loadingPosts = (loading: boolean): LoadingPosts => ({
  type: "LOADING_POSTS",
  payload: loading,
});

export const hasMorePosts = (hasMorePosts: boolean): HasMorePosts => ({
  type: "HAS_MORE_POSTS",
  payload: hasMorePosts,
});

export const setLastPostDocRef = (
  lastDocRef: DocumentData
): SetLastPostDocRef => ({
  type: "SET_LAST_POST_DOC_REF",
  payload: lastDocRef,
});

export const setPostContent = (
  postContent: string,
  postId: string
): SetPostContent => ({
  type: "SET_POST_CONTENT",
  postId,
  payload: postContent,
});

export const getPosts =
  () =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    // If there are no more posts to load
    if (!getState().posts.hasMore) return false;

    dispatch(loadingPosts(true));
    const postsArray: Post[] = [];
    const postsRef = firestoreRef.collection("posts");
    const lastDoc = getState().posts.lastPostDocRef;
    const limit = getRequestLimitByWindowWidth("posts");
    let numOfDoc = 0;
    try {
      const qs = lastDoc // Query Snapshot depends on if lastDocRef is present
        ? await postsRef
            .orderBy("publishedAt", "desc")
            .where("isPrivate", "==", false)
            .where("isPublished", "==", true)
            .startAfter(lastDoc)
            .limit(limit)
            .get()
        : await postsRef
            .orderBy("publishedAt", "desc")
            .where("isPrivate", "==", false)
            .where("isPublished", "==", true)
            .limit(limit)
            .get();

      if (!qs.empty) {
        for (const doc of qs.docs) {
          numOfDoc++;
          if (numOfDoc === qs.docs.length) dispatch(setLastPostDocRef(doc));
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
            isBookmarked: Math.random() > 0.5 ? true : false,
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
        dispatch(hasMorePosts(false));
        dispatch(loadingPosts(false));
        return true;
      }
      if (postsArray.length > 0) dispatch(populatePosts(postsArray));
      if (postsArray.length < limit) {
        dispatch(
          setNotification({ text: getNotificationMessage("no-more-posts") })
        );
        dispatch(hasMorePosts(false));
      }
      dispatch(loadingPosts(false));
      return true;
    } catch (err) {
      dispatch(loadingPosts(false));
      customFirebaseErrorMessage(err);
      console.error(err);
      return false;
    }
  };

export const getPostById =
  (postId: string) =>
  async (
    dispatch: Dispatch,
    getState: () => RootState
  ): Promise<false | Post> => {
    dispatch(loadingPosts(true));
    // check for the post in state
    let post: Post;
    const state = getState();

    post = state.userPublishedPosts.posts.filter(
      (post) => post.id === postId
    )[0];
    post = state.userUnpublishedPosts.posts.filter(
      (post) => post.id === postId
    )[0];
    if (post === undefined)
      post = state.posts.posts.filter((post) => post.id === postId)[0];

    // return post if found
    if (post !== undefined) {
      if (post.content) {
        dispatch(loadingPosts(false));
        return post;
      }
      try {
        post.content = await getPostContent(post.id);
        setPostContent(post.content, post.id);
        dispatch(loadingPosts(false));
        return post;
      } catch (err) {
        console.error(err);
        dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
        dispatch(loadingPosts(false));
        return false;
      }
    }
    // make a request if not present in state
    try {
      const postDoc = await firestoreRef.doc(`posts/${postId}`).get();
      if (!postDoc.exists) {
        dispatch(loadingPosts(false));
        return false;
      }
      const postData = postDoc.data() as PostSchemaRes;
      const content = await getPostContent(postDoc.id);
      const authorAvatar = await getUserAvatarUrlById(
        postData.createdBy.userId
      );
      dispatch(loadingPosts(false));
      const postForState = {
        ...postData,
        createdBy: {
          userId: postData.createdBy.userId,
          userAvatar: authorAvatar,
        },
        content: content,
        id: postDoc.id,
        isBookmarked: Math.random() > 0.5 ? true : false,
      };
      return postForState;
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(loadingPosts(false));
      console.error(err);
      return false;
    }
  };

export const createNewPost =
  (post: CreateNewPostData, publish: boolean = false) =>
  async (dispatch: Dispatch): Promise<boolean | string> => {
    if (!firebaseAuth.currentUser) {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      return false;
    }
    const validTypes = ["story", "book", "blog", "poem", "journal"];
    const { description, content, title, type, hashtags, genre } = post;
    const sanitizedContent = sanitizePostContent(content);
    const sanitizedDescription = description.trim();
    const sanitizedHashtags = trimStringArray(
      hashtags.filter((v, i, arr) => v && arr.indexOf(v) === i)
    );
    const sanitizedGenre = trimStringArray(
      genre.filter((v, i, arr) => v && arr.indexOf(v) === i)
    );
    const sanitizedTitle = title.trim();

    const textFromHTML = getTextFromHTML(sanitizedContent);
    const contentSnippet = shortenText(textFromHTML, 300);
    const readTime = calcAverageReadTime(textFromHTML);

    if (!validTypes.includes(type)) {
      dispatch(
        setNotification({ text: getNotificationMessage("invalid-post-type") })
      );
      return false;
    }

    if (!sanitizedContent && !sanitizedTitle && !publish) {
      dispatch(
        setNotification({
          text: getNotificationMessage("content-or-title-required"),
        })
      );
      return false;
    }

    if ((!sanitizedContent || !sanitizedTitle) && publish) {
      dispatch(
        setNotification({
          text: !sanitizedContent
            ? getNotificationMessage("content-required" as const)
            : getNotificationMessage("title-required" as const),
        })
      );
      return false;
    }

    dispatch(setRequestActive(true));
    const userId = firebaseAuth.currentUser.uid;
    let userRef: DocumentData | null = null;
    try {
      userRef = await firestoreRef.doc(`users/${userId}`).get();
    } catch (err) {
      console.error(err);
      return false;
    }
    const user: UserSchema = userRef.data() as UserSchema;
    const { username, profileAvatar } = user;

    const newPost: PostSchema = {
      description: sanitizedDescription,
      contentSnippet,
      createdBy: {
        userId,
      },
      author: username,
      title: sanitizedTitle,
      hashtags: sanitizedHashtags,
      img: "",
      isPublished: publish ? true : false,
      views: 0,
      averageRating: 0,
      numberOfRatings: 0,
      numberOfShares: 0,
      numberOfBookmarks: 0,
      isPrivate: false,
      estimatedTimeToRead: readTime,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      publishedAt: publish
        ? firebase.firestore.FieldValue.serverTimestamp()
        : null,
      type: type,
      genre: sanitizedGenre,
    };

    const newPostRef = firestoreRef.collection("posts").doc();
    try {
      await firestoreRef.doc(`posts/${newPostRef.id}`).set(newPost);
      !publish &&
        dispatch(
          addUnpublishedPost({
            ...newPost,
            content: sanitizedContent,
            createdBy: {
              userId: userId,
              userAvatar: profileAvatar,
            },
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isBookmarked: false,
            id: newPostRef.id,
            publishedAt: null,
          })
        );
      removeLocalTempPostByType(type);
    } catch (err) {
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(setRequestActive(false));
      console.error(err);
      return false;
    }

    if (publish) {
      let contentWithIds = sanitizedContent;

      const postQuestions = extractQuestionsFromPostContent(sanitizedContent);
      if (postQuestions && postQuestions.length > 0) {
        const questionsTextArray: string[] = [];
        for (const question of postQuestions) {
          questionsTextArray.push(question.split("Q:")[1].trim());
        }

        const questionIds = await uploadPostQuestions(
          newPostRef.id,
          questionsTextArray
        );

        if (questionIds)
          contentWithIds = addQuestionIdsToPostContent(
            questionIds,
            postQuestions,
            sanitizedContent
          );
      }

      const contentWithIdsSplit = splitStringByByteSize(
        contentWithIds,
        1000000
      );

      const postDocRef = firestoreRef.doc(`posts/${newPostRef.id}`);
      const userDocRef = firestoreRef.doc(`users/${userId}`);
      const batch = firestoreRef.batch();

      contentWithIdsSplit.forEach((contentPart, i) =>
        batch.set(firestoreRef.doc(`posts/${postDocRef.id}/content/${i}`), {
          content: contentPart,
        })
      );
      batch.update(userDocRef, {
        numberOfPublishedPosts: firebase.firestore.FieldValue.increment(1),
        totalTimeOfAllPosts: firebase.firestore.FieldValue.increment(readTime),
      });

      try {
        await batch.commit();
        const publishedPost: Post = {
          ...newPost,
          id: postDocRef.id,
          isBookmarked: false,
          createdBy: { ...newPost.createdBy, userAvatar: profileAvatar },
          content: contentWithIds,
          publishedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        dispatch(addPublishedPost(publishedPost));
        dispatch(addPost(publishedPost));
        dispatch(setRequestActive(false));
        return true;
      } catch (err) {
        console.error(err);
        dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
        dispatch(setRequestActive(false));
        return false;
      }
    } else {
      // Splitting content if it doesn't fit in a single firestore document
      const contentSplit = splitStringByByteSize(sanitizedContent, 1000000);
      try {
        let i = 0;
        for (const contentPart of contentSplit) {
          await firestoreRef
            .doc(`posts/${newPostRef.id}/content/${i}`)
            .set({ content: contentPart });
          i++;
        }
        dispatch(setRequestActive(false));
        return newPostRef.id;
      } catch (err) {
        dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
        dispatch(setRequestActive(false));
        console.error(err);
        return false;
      }
    }
  };

export const publishPost =
  (postId: string, postData: PublishPostData) =>
  async (dispatch: Dispatch, getState: () => RootState): Promise<boolean> => {
    // Has to be logged in
    if (!firebaseAuth.currentUser) {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      return false;
    }
    dispatch(setRequestActive(true));
    const userId = firebaseAuth.currentUser.uid;
    const { description, content, title, hashtags, genre, type } = postData;
    const sanitizedContent = sanitizePostContent(content);
    const sanitizedTitle = title.trim();
    // Content Required
    if (!sanitizedContent) {
      dispatch(
        setNotification({ text: getNotificationMessage("content-required") })
      );
      dispatch(setRequestActive(false));
      return false;
    }
    // Title Required
    if (!sanitizedTitle) {
      dispatch(
        setNotification({ text: getNotificationMessage("title-required") })
      );
      dispatch(setRequestActive(false));
      return false;
    }

    const sanitizedDescription = description.trim();
    const sanitizedHashtags = trimStringArray(
      hashtags.filter((v, i, arr) => v && arr.indexOf(v) === i)
    );
    const sanitizedGenre = trimStringArray(
      genre.filter((v, i, arr) => v && arr.indexOf(v) === i)
    );

    const textFromHtml = getTextFromHTML(sanitizedContent);
    const contentSnippet = shortenText(textFromHtml, 300);
    const readTime = calcAverageReadTime(textFromHtml);

    let contentWithIds = sanitizedContent;

    const postQuestions = extractQuestionsFromPostContent(sanitizedContent);
    if (postQuestions && postQuestions.length > 0) {
      const questionsTextArray: string[] = [];
      for (const question of postQuestions) {
        questionsTextArray.push(question.split("Q:")[1].trim());
      }

      const questionIds = await uploadPostQuestions(postId, questionsTextArray);

      if (questionIds)
        contentWithIds = addQuestionIdsToPostContent(
          questionIds,
          postQuestions,
          sanitizedContent
        );
    }

    const contentWithIdsSplit = splitStringByByteSize(contentWithIds, 1000000);

    const postDocRef = firestoreRef.doc(`posts/${postId}`);
    const userDocRef = firestoreRef.doc(`users/${userId}`);
    const batch = firestoreRef.batch();

    contentWithIdsSplit.forEach((contentPart, i) => {
      batch.set(firestoreRef.doc(`posts/${postId}/content/${i}`), {
        content: contentPart,
      });
    });

    batch.update(postDocRef, {
      hashtags: sanitizedHashtags,
      genre: sanitizedGenre,
      description: sanitizedDescription,
      title: sanitizedTitle,
      contentSnippet,
      isPublished: true,
      publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
      estimatedTimeToRead: readTime,
    });

    batch.update(userDocRef, {
      numberOfPublishedPosts: firebase.firestore.FieldValue.increment(1),
      totalTimeOfAllPosts: firebase.firestore.FieldValue.increment(readTime),
    });

    try {
      await batch.commit();
      const publishedPost: Post = {
        id: postId,
        type,
        img: "",
        hashtags: sanitizedHashtags,
        genre: sanitizedGenre,
        description: sanitizedDescription,
        title: sanitizedTitle,
        contentSnippet,
        isPublished: true,
        estimatedTimeToRead: readTime,
        content: contentWithIds,
        publishedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        averageRating: 0,
        author: getState().user.username,
        createdBy: {
          userId,
          userAvatar: getState().user.profileAvatar,
        },
        isBookmarked: false,
        isPrivate: false,
        numberOfBookmarks: 0,
        numberOfRatings: 0,
        numberOfShares: 0,
        views: 0,
      };

      dispatch(removeUnpublishedPost(postId));
      dispatch(addPublishedPost(publishedPost));
      dispatch(addPost(publishedPost));
      removeLocalUnpublishedPostById(postId);
      dispatch(setRequestActive(false));
      return true;
    } catch (err) {
      console.error(err);
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(setRequestActive(false));
      return false;
    }
  };

export const uploadPostQuestions = async (
  postId: string,
  postQuestions: string[]
): Promise<false | string[]> => {
  const user = firebaseAuth.currentUser;
  if (!user) return false;
  const userId = user.uid;
  const questionIds: string[] = [];
  const batch = firestoreRef.batch();
  for (const question of postQuestions) {
    const questionToAdd: PostQuestionSchema = {
      text: question.slice(0, -1),
      createdBy: { userId },
    };

    const newQuestionRef = firestoreRef
      .collection(`posts/${postId}/questions`)
      .doc();
    questionIds.push(newQuestionRef.id);
    batch.set(newQuestionRef, questionToAdd);
  }

  try {
    await batch.commit();
    return questionIds;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const savePostToCloud =
  (postId: string, postData: PublishPostData) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    // Has to be logged in
    if (!firebaseAuth.currentUser) {
      dispatch(
        setNotification({ text: getNotificationMessage("login-required") })
      );
      return false;
    }

    const { description, content, title, hashtags, genre, type } = postData;
    const sanitizedContent = sanitizePostContent(content);
    const sanitizedTitle = title.trim();
    // Content Required
    if (!sanitizedContent && !sanitizedTitle) {
      dispatch(
        setNotification({
          text: getNotificationMessage("content-or-title-required"),
        })
      );
      return false;
    }

    dispatch(setSavingToCloud(true));
    const sanitizedDescription = description.trim();
    const sanitizedHashtags = trimStringArray(
      hashtags.filter((v, i, arr) => v && arr.indexOf(v) === i)
    );
    const sanitizedGenre = trimStringArray(
      genre.filter((v, i, arr) => v && arr.indexOf(v) === i)
    );

    const textFromHtml = getTextFromHTML(sanitizedContent);
    const contentSnippet = shortenText(textFromHtml, 300);
    const readTime = calcAverageReadTime(textFromHtml);
    const sanitizedContentSplit = splitStringByByteSize(
      sanitizedContent,
      1000000
    );

    const postDocRef = firestoreRef.doc(`posts/${postId}`);
    const batch = firestoreRef.batch();

    sanitizedContentSplit.forEach((contentPart, i) => {
      batch.set(firestoreRef.doc(`posts/${postId}/content/${i}`), {
        content: contentPart,
      });
    });

    batch.update(postDocRef, {
      hashtags: sanitizedHashtags,
      genre: sanitizedGenre,
      description: sanitizedDescription,
      title: sanitizedTitle,
      contentSnippet,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      estimatedTimeToRead: readTime,
    });

    try {
      await batch.commit();
      const unpublishedPostUpdate: UnpublishedPostUpdateData = {
        type,
        img: "",
        hashtags: sanitizedHashtags,
        genre: sanitizedGenre,
        description: sanitizedDescription,
        title: sanitizedTitle,
        contentSnippet,
        estimatedTimeToRead: readTime,
        content: sanitizedContent,
        updatedAt: Date.now(),
      };
      dispatch(updateUnpublishedPost(postId, unpublishedPostUpdate));
      dispatch(setSavingToCloud(false));
      dispatch(
        setNotification({
          text: getNotificationMessage("post-saved"),
        })
      );
      return true;
    } catch (err) {
      console.error(err);
      dispatch(setNotification({ text: customFirebaseErrorMessage(err) }));
      dispatch(setSavingToCloud(false));
      return false;
    }
  };

export const getPostContent = async (postId: string): Promise<string> => {
  const qs = await firestoreRef.collection(`posts/${postId}/content`).get();
  if (qs.empty) return "";
  let postContent = "";
  for (const doc of qs.docs) {
    const post = doc.data() as { content: string };
    postContent = postContent + post.content;
  }
  return postContent;
};

const extractQuestionsFromPostContent = (
  postContent: string
): RegExpMatchArray | null => {
  return postContent.match(
    /<(h1|h2|h3|p|u|em|strong)( ?)(.*?)>Q: (.*?)\?( )?(&nbsp;)?</g
  );
};

const addQuestionIdsToPostContent = (
  questionIds: string[],
  postQuestions: string[],
  sanitizedContent: string
) => {
  let contentWithIds = sanitizedContent;
  questionIds.forEach((id, i) => {
    const regexp = new RegExp(
      `${postQuestions[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}` // .replace() to escape any special characters
    );
    // add ids to
    const split = postQuestions[i].split(">");
    split[0] = `${split[0]} data-question-id="${id}"`;
    const properString = split.toString().replace(/,/g, ">");
    contentWithIds = contentWithIds.replace(regexp, properString);
  });
  return contentWithIds;
};

const calcAverageReadTime = (text: string, charPerMinute: number = 1800) => {
  return Math.ceil(text.length / charPerMinute);
};

// export const testPopulatePosts = () => async (dispatch: Dispatch) => {
//   const posts = data.cards;
//   if (firebaseAuth.currentUser) {
//     const userId = firebaseAuth.currentUser.uid;
//     const userRef = await firestoreRef.doc(`users/${userId}`).get();
//     const user: UserSchema = userRef.data() as UserSchema;

//     if (user) {
//       for (const post of posts) {
//         const { text, title } = post;
//         const { username, profileAvatar } = user;
//         const randomType = Math.random();
//         const randAverageRating = (Math.ceil(Math.random() * 400) + 100) / 100;
//         const randIsPublished = Math.random() > 0.5 ? true : false;

//         const newPost: PostSchema = {
//           createdBy: {
//             userId,
//           },
//           author: username,
//           title: title,
//           type:
//             randomType <= 0.2
//               ? "story"
//               : randomType <= 0.4
//               ? "blog"
//               : randomType <= 0.6
//               ? "book"
//               : randomType <= 0.8
//               ? "journal"
//               : "poem",
//           contentSnippet: shortenText(text, 300),
//           description: "some random description let's see if it even works",
//           hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
//           img: "",
//           isPublished: randIsPublished,
//           views: randIsPublished ? Math.floor(Math.random() * 2000000) : 0,
//           averageRating: randIsPublished ? randAverageRating : 0,
//           numberOfRatings: randIsPublished ? Math.ceil(Math.random() * 500) : 0,
//           numberOfShares: randIsPublished ? Math.ceil(Math.random() * 500) : 0,
//           numberOfBookmarks: randIsPublished
//             ? Math.ceil(Math.random() * 500)
//             : 0,
//           isPrivate: Math.random() > 0.5 ? true : false,
//           estimatedTimeToRead: Math.floor(Math.random() * 120),
//           createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//           updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
//           publishedAt: randIsPublished
//             ? firebase.firestore.FieldValue.serverTimestamp()
//             : null,
//           genre: ["fiction"],
//         };

//         let newPostId: string = "";
//         try {
//           const newPostRef = await firestoreRef
//             .collection("posts")
//             .add(newPost);
//           newPostId = newPostRef.id;
//           console.log(newPostId);

//           randIsPublished &&
//             (await firestoreRef
//               .doc(`users/${userId}`)
//               .update(
//                 "numberOfPublishedPosts",
//                 firebase.firestore.FieldValue.increment(1)
//               ));

//           let wIds = text;
//           const postQuestions = extractQuestionsFromPostContent(text);
//           if (postQuestions) {
//             const questionsTextArray: string[] = [];
//             for (const question of postQuestions) {
//               questionsTextArray.push(question.split("Q:")[1].trim());
//             }
//             console.log(postQuestions);
//             const questionIds = await uploadPostQuestions(
//               newPostId,
//               questionsTextArray
//             );

//             if (questionIds) {
//               questionIds.forEach((id, i) => {
//                 const regexp = new RegExp(
//                   `${postQuestions[i].replace(
//                     /[-\/\\^$*+?.()|[\]{}]/g,
//                     "\\$&"
//                   )}` // .replace() to escape any special characters
//                 );
//                 // add ids to
//                 const split = postQuestions[i].split(">");
//                 split[0] = `${split[0]} data-question-id="${id}"`;
//                 const properString = split.toString().replace(/,/g, ">");
//                 wIds = wIds.replace(regexp, properString);
//               });
//             }
//             console.log(wIds);
//             const wIdsSplit = splitString(wIds, 1000000);

//             dispatch(
//               populatePosts([
//                 {
//                   ...newPost,
//                   content: wIdsSplit[0],
//                   createdBy: {
//                     userId,
//                     userAvatar: profileAvatar,
//                   },
//                   id: newPostRef.id,
//                   createdAt: Date.now(),
//                   updatedAt: Date.now(),
//                   publishedAt: null,
//                   isBookmarked: Math.random() > 0.5 ? true : false,
//                 },
//               ])
//             );
//             // ***********************************************************************
//             try {
//               let i = 0;
//               for (const contentPart of /*contentSplit*/ wIdsSplit) {
//                 i++;
//                 await firestoreRef
//                   .doc(`posts/${newPostId}/content/${i}`)
//                   .set({ content: contentPart });
//               }
//               dispatch(changeRequestActive(false));
//             } catch (err) {
//               dispatch(
//                 setNotification({ text: customFirebaseErrorMessage(err) })
//               );
//               dispatch(changeRequestActive(false));
//               console.error(err);
//             }
//           }
//         } catch (err) {
//           console.error(err.message);
//         }
//       }
//     }
//   }
// };
