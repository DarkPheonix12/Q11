import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const firestoreRef = admin.firestore();

export const onUserActivityUpdate = functions.firestore
  .document("userActivity/{userActivity}")
  .onUpdate(async (snapshot) => {
    const newQuestionLikes: string[] = snapshot.after.data().questionLikes;
    const prevQuestionLikes: string[] = snapshot.before.data().questionLikes;

    const newAnswerLikes: string[] = snapshot.after.data().answerLikes;
    const prevAnswerLikes: string[] = snapshot.before.data().answerLikes;

    const newPostQuestionAnswerLikes: string[] =
      snapshot.after.data().postQuestionAnswerLikes;
    const prevPostQuestionAnswerLikes: string[] =
      snapshot.before.data().postQuestionAnswerLikes;

    // const newBookmarks: {
    //   postId: string;
    //   scrollPosition: number;
    // }[] = snapshot.after.data().bookmarks;
    // const prevBookmarks: {
    //   postId: string;
    //   scrollPosition: number;
    // }[] = snapshot.before.data().bookmarks;

    const newFollowing: string[] = snapshot.after.data().following;
    const prevFollowing: string[] = snapshot.before.data().following;

    // const newRatedPosts: {
    //   postId: string;
    //   rating: number;
    // }[] = snapshot.after.data().ratedPosts;
    // const prevRatedPosts: {
    //   postId: string;
    //   rating: number;
    // }[] = snapshot.before.data().ratedPosts;

    // Update Question Likes
    if (newQuestionLikes.length > prevQuestionLikes.length) {
      console.log("question like");
      // Like
      const questionId = newQuestionLikes.filter(
        (value) => !prevQuestionLikes.includes(value)
      )[0];
      try {
        return await firestoreRef
          .doc(`questions/${questionId}`)
          .update({ likes: admin.firestore.FieldValue.increment(1) });
      } catch (err) {
        console.log(err);
        return err;
      }
    } else if (newQuestionLikes.length < prevQuestionLikes.length) {
      console.log("question unlike");
      // Unlike
      const questionId = prevQuestionLikes.filter(
        (value) => !newQuestionLikes.includes(value)
      )[0];
      try {
        return await firestoreRef
          .doc(`questions/${questionId}`)
          .update({ likes: admin.firestore.FieldValue.increment(-1) });
      } catch (err) {
        console.log(err);
        return err;
      }
    }

    // Update Answer Likes
    if (newAnswerLikes.length > prevAnswerLikes.length) {
      console.log("answer like");
      // Like
      const answerId = newAnswerLikes.filter(
        (value) => !prevAnswerLikes.includes(value)
      )[0];
      try {
        return await firestoreRef
          .doc(`answers/${answerId}`)
          .update({ likes: admin.firestore.FieldValue.increment(1) });
      } catch (err) {
        console.log(err);
        return err;
      }
    } else if (newAnswerLikes.length < prevAnswerLikes.length) {
      console.log("answer unlike");
      // Unlike
      const answerId = prevAnswerLikes.filter(
        (value) => !newAnswerLikes.includes(value)
      )[0];
      try {
        return await firestoreRef
          .doc(`answers/${answerId}`)
          .update({ likes: admin.firestore.FieldValue.increment(-1) });
      } catch (err) {
        console.log(err);
        return err;
      }
    }

    // Update Post Question Answer likes
    if (
      newPostQuestionAnswerLikes.length > prevPostQuestionAnswerLikes.length
    ) {
      console.log("post question answer like");
      // Like
      const answerId = newPostQuestionAnswerLikes.filter(
        (value) => !prevPostQuestionAnswerLikes.includes(value)
      )[0];
      try {
        return await firestoreRef
          .doc(`postQuestionAnswers/${answerId}`)
          .update({ likes: admin.firestore.FieldValue.increment(1) });
      } catch (err) {
        console.log(err);
        return err;
      }
    } else if (
      newPostQuestionAnswerLikes.length < prevPostQuestionAnswerLikes.length
    ) {
      console.log("post question answer unlike");
      // Unlike
      const answerId = prevPostQuestionAnswerLikes.filter(
        (value) => !newPostQuestionAnswerLikes.includes(value)
      )[0];
      try {
        return await firestoreRef
          .doc(`postQuestionAnswers/${answerId}`)
          .update({ likes: admin.firestore.FieldValue.increment(-1) });
      } catch (err) {
        console.log(err);
        return err;
      }
    }

    // Update Followers Count for Followed User
    if (newFollowing.length > prevFollowing.length) {
      console.log("follow");
      const followedUserId = newFollowing.filter(
        (value) => !prevFollowing.includes(value)
      )[0];

      try {
        return await firestoreRef
          .doc(`users/${followedUserId}`)
          .update({ followers: admin.firestore.FieldValue.increment(1) });
      } catch (err) {
        console.log(err);
        return err;
      }
    } else if (newFollowing.length < prevFollowing.length) {
      console.log("unfollow");
      const followedUserId = prevFollowing.filter(
        (value) => !newFollowing.includes(value)
      )[0];

      try {
        return await firestoreRef
          .doc(`users/${followedUserId}`)
          .update({ followers: admin.firestore.FieldValue.increment(-1) });
      } catch (err) {
        console.log(err);
        return err;
      }
    }
    return null;
  });

export const incrementQuestionShares = functions.https.onCall(async (data) => {
  const questionId = data.questionId;
  try {
    await firestoreRef
      .doc(`questions/${questionId}`)
      .update({ numberOfShares: admin.firestore.FieldValue.increment(1) });
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
});
