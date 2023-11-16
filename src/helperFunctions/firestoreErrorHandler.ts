import firebase from "../firebase";

export const customFirebaseErrorMessage = (err: firebase.FirebaseError) => {
  console.log(err.message);
  switch (err.code) {
    case "auth/email-already-in-use":
      return "Email already exists";
    case "auth/invalid-email":
      return "Please enter a valid email";
    case "auth/user-not-found":
      return "There is no account associated with this email";
    case "auth/wrong-password":
      return "Invalid password";
    case "auth/weak-password":
      return "Password should be at least 6 characters long";
    default:
      return "An Error Has Occured";
  }
};
