const codes = [
  "no-more-questions",
  "no-questions-posted",
  "no-liked-questions",
  "no-more-answers",
  "no-answers-yet",
  "no-user-answers-yet",
  "no-more-posts",
  "user-no-published-posts",
  "no-published-posts",
  "no-created-posts",
  "no-asked-questions",
  "no-posts-created",
  "no-more-followers",
  "no-followers",
  "login-required",
  "password-empty",
  "current-password-empty",
  "new-password-empty",
  "confirm-password-empty",
  "passwords-not-matching",
  "passwords-same",
  "invalid-email",
  "email-empty",
  "password-reset-success",
  "password-change-success",
  "question-empty",
  "link-copied",
  "user-read-time",
  "user-total-time-of-posts",
  "user-exists",
  "no-user",
  "answer-empty",
  "please-relog",
  "full-name-required",
  "username-required",
  "username-exists",
  "follow-success",
  "unfollow-success",
  "img-upload-success",
  "no-follows",
  "no-more-followed-users",
  "if-account-email-exists",
  "email-for-password-reset",
  "thank-you-beta",
  "unsupported-file-format",
  "no-file-selected",
  "user-already-followed",
  "title-required",
  "content-required",
  "invalid-post-type",
  "content-or-title-required",
  "post-saved",
] as const;

export const getNotificationMessage = (code: typeof codes[number]): string => {
  let message = "";
  switch (code) {
    case "no-more-answers":
      message = "No more answers to display";
      break;
    case "no-questions-posted":
      message =
        "Nobody has asked anything yet. Be the first one to ask a question!";
      break;
    case "no-user-answers-yet":
      message = "You haven't answered any questions yet";
      break;
    case "no-answers-yet":
      message = "There are no answers for this question yet";
      break;
    case "no-more-questions":
      message = "No more questions to display";
      break;
    case "no-asked-questions":
      message = "You haven't asked any questions yet";
      break;
    case "no-liked-questions":
      message = "You haven't liked any questions yet";
      break;
    case "no-more-posts":
      message = "No more posts to display";
      break;
    case "user-no-published-posts":
      message = "You haven't published any posts yet";
      break;
    case "no-published-posts":
      message =
        "Nobody published anything yet. Be the first one to publish a post!";
      break;
    case "no-created-posts":
      message = "You haven't created any posts yet";
      break;
    case "no-followers":
      message = "Nobody is following you at this time";
      break;
    case "no-more-followers":
      message = "No more followers to display";
      break;
    case "login-required":
      message = "Please either log in or register to continue";
      break;
    case "current-password-empty":
      message = "Current password is empty";
      break;
    case "new-password-empty":
      message = "New Password is Empty";
      break;
    case "confirm-password-empty":
      message = "Confirm password is empty";
      break;
    case "passwords-not-matching":
      message = "Passwords Don't match";
      break;
    case "passwords-same":
      message = "Passwords are the same";
      break;
    case "invalid-email":
      message = "Please enter a valid email address";
      break;
    case "email-empty":
      message = "Please enter an email address";
      break;
    case "password-reset-success":
      message = "Password successfully reset";
      break;
    case "password-change-success":
      message = "Password successfully changed";
      break;
    case "question-empty":
      message = "Question can't be empty";
      break;
    case "link-copied":
      message = "Link Copied!";
      break;
    case "user-read-time":
      message = "Amount of time you have read";
      break;
    case "user-total-time-of-posts":
      message = "Total time of all of your posts";
      break;
    case "user-exists":
      message = "User already exists";
      break;
    case "no-user":
      message = "User doesn't exist";
      break;
    case "answer-empty":
      message = "Answer cannot be empty";
      break;
    case "please-relog":
      message = "Please relog if this issue persists";
      break;
    case "full-name-required":
      message = "Full name is required";
      break;
    case "username-exists":
      message = "Username is required";
      break;
    case "username-required":
      message = "Username already exists";
      break;
    case "follow-success":
      message = "User successfully followed";
      break;
    case "unfollow-success":
      message = "User successfully unfollowed";
      break;
    case "img-upload-success":
      message = "Image uploaded successfully";
      break;
    case "no-follows":
      message = "You haven't followed anybody yet";
      break;
    case "no-more-followed-users":
      message = "No More Followed Users To Display";
      break;
    case "if-account-email-exists":
      message =
        "If an account with this email exists we've sent you a password reset email";
      break;
    case "email-for-password-reset":
      message =
        "Please provide us with your email first so we can send you a password reset link";
      break;
    case "thank-you-beta":
      message = "Thank you for signing up to be our BETA tester!";
      break;
    case "unsupported-file-format":
      message = "Unsupported file format";
      break;
    case "no-file-selected": {
      message = "No file selected";
      break;
    }
    case "user-already-followed": {
      message = "User already followed";
      break;
    }
    case "title-required": {
      message = "Title can't be empty";
      break;
    }
    case "content-required": {
      message = "Content can't be empty";
      break;
    }
    case "invalid-post-type": {
      message = "Invalid post type";
      break;
    }
    case "content-or-title-required": {
      message = "Content or title are required";
      break;
    }
    case "post-saved": {
      message = "Cloud save successful";
      break;
    }
  }
  return message;
};
