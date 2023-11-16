import firebase from "./firebase";
import {
  AnswerSchema,
  FollowingSchema,
  PostQuestionAnswerSchema,
  PostQuestionSchema,
  PostRatingsSchema,
  PostSchema,
  QuestionSchema,
  ReportSchema,
  UserSchema,
} from "./schemas";
import { ModifyInterface } from "./types";
export interface UserSchemaRes
  extends ModifyInterface<
    UserSchema,
    {
      createdAt: firebase.firestore.Timestamp;
      updatedAt: firebase.firestore.Timestamp;
    }
  > {}

export interface PostSchemaRes
  extends ModifyInterface<
    PostSchema,
    {
      createdAt: firebase.firestore.Timestamp | number;
      updatedAt: firebase.firestore.Timestamp | number;
      publishedAt: firebase.firestore.Timestamp | number | null;
    }
  > {}

export interface PostQuestionAnswerSchemaRes
  extends ModifyInterface<
    PostQuestionAnswerSchema,
    {
      createdAt: firebase.firestore.Timestamp;
      updatedAt: firebase.firestore.Timestamp;
    }
  > {}

export interface QuestionSchemaRes
  extends ModifyInterface<
    QuestionSchema,
    {
      createdAt: firebase.firestore.Timestamp;
    }
  > {}

export interface AnswerSchemaRes
  extends ModifyInterface<
    AnswerSchema,
    {
      createdAt: firebase.firestore.Timestamp;
    }
  > {}

export interface FollowingSchemaRes
  extends ModifyInterface<
    FollowingSchema,
    {
      createdAt: firebase.firestore.Timestamp;
    }
  > {}

export interface PostRatingsSchemaRes
  extends ModifyInterface<
    PostRatingsSchema,
    {
      createdAt: firebase.firestore.Timestamp;
      updatedAt: firebase.firestore.Timestamp;
    }
  > {}

export interface ReportSchemaRes
  extends ModifyInterface<
    ReportSchema,
    {
      createdAt: firebase.firestore.Timestamp;
    }
  > {}
