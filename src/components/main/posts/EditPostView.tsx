import React, { useEffect, useMemo, useState } from "react";
import TinyEditor from "./postEditComponents/TinyEditor";
import { ArrowDown, ArrowLeft } from "../../helperComponents/svgIcons";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import {
  RootState,
  setNotification,
  Notification,
  publishPost,
  PublishPostData,
  getPostById,
  Post,
  savePostToCloud,
} from "../../../redux";
import TextareaAutosize from "react-textarea-autosize";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import PostEditOverlayPreviewModal from "./postEditComponents/postEditOverlay/PostEditOverlay_PreviewModal";
import {
  getLocalUnpublishedPostById,
  updateLocalUnpublishedPost,
} from "../../../helperFunctions/localStorageActions";
import { debounce, getFormattedDateString } from "../../../helperFunctions";
import { LocalUnpublishedPostData } from "../../../types";
import PostEditOverlay from "./postEditComponents/postEditOverlay/PostEditOverlay";
import { Timestamp } from "@google-cloud/firestore";
import ConfirmationDialogModal from "../../helperComponents/modals/ConfirmationDialogModal";
import Spinner from "../../helperComponents/Spinner";
import { PostTypes } from "../../../schemas";

interface EditPostViewProps {
  author: string;
  isRequestActive: boolean;
  isSavingToCloud: boolean;
  loading: boolean;
  getPostById: (postId: string) => Promise<false | Post>;
  publishPost: (postId: string, post: PublishPostData) => Promise<boolean>;
  savePostToCloud: (
    postId: string,
    postData: PublishPostData
  ) => Promise<boolean>;
  setNotification: typeof setNotification;
}

interface PostFormData {
  description: string;
  hashtags: string;
  genre: string;
  title: string;
  content: string;
  type: PostTypes;
  updatedAt: number | Timestamp;
}

const EditPostView: React.FC<EditPostViewProps> = ({
  author,
  isRequestActive,
  isSavingToCloud,
  loading,
  getPostById,
  publishPost,
  savePostToCloud,
  setNotification,
}) => {
  const [isOverlayHidden, setIsOverlayHidden] = useState<boolean>(true);
  const [isPreviewModalHidden, setIsPreviewModalHidden] =
    useState<boolean>(true);
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(false);
  const [isDescriptionHidden, setIsDescriptionHidden] =
    useState<boolean>(false);
  const [loadLocal, setLoadLocal] = useState<boolean | null>(null);
  const [localProgressExists, setLocalProgressExists] = useState<
    boolean | null
  >(null);
  const [postFormData, setPostFormData] = useState<PostFormData>({
    description: "",
    hashtags: "",
    genre: "",
    title: "",
    content: "",
    type: "blog",
    updatedAt: 0,
  });
  const { description, hashtags, genre, title, content, type, updatedAt } =
    postFormData;

  const history = useHistory();
  const postId = useParams<{ postId: string }>().postId;

  const debounceUpdateLocalPost = useMemo(
    () =>
      debounce((postUpdateData: LocalUnpublishedPostData) =>
        updateLocalUnpublishedPost(postUpdateData)
      ),
    []
  );

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (localProgressExists === null) return;
    const name = e.target.name as keyof typeof postFormData;
    let newValue: string;
    switch (name) {
      case "hashtags": {
        if (e.target.value.length === 0) newValue = "";
        const hashtagsArray = e.target.value.split(" ");
        hashtagsArray.forEach((hashtag, i) => {
          if (!hashtag) newValue = "";
          if (hashtag[0] !== "#") hashtagsArray[i] = `#${hashtag}`;
          if (hashtag === "#") hashtagsArray[i] = "";
        });

        newValue = hashtagsArray
          .toString()
          .replace(/,/g, " ")
          .replace(/([^a-zA-Z0-9]*#[^a-zA-Z0-9]*)/g, " #")
          .replace(/ /, "");
        break;
      }

      case "genre": {
        if (e.target.value.length > genre.length) {
          newValue = e.target.value.replace(
            /([^a-zA-Z0-9]* )|([^a-zA-Z0-9]*,[^a-zA-Z0-9]*)/g,
            ", "
          );
        } else newValue = e.target.value;
        break;
      }

      default:
        newValue = e.target.value;
    }

    setPostFormData((prev) => ({
      ...prev,
      [name]: newValue,
      updatedAt: Date.now(),
    }));
    debounceUpdateLocalPost({
      id: postId,
      type,
      [name]: e.target.value,
      updatedAt: Date.now(),
    });
  };

  const onContentChange = useMemo(
    () => (newValue: string) => {
      if (localProgressExists === null) return;
      setPostFormData((prev) => ({
        ...prev,
        content: newValue,
        updatedAt: Date.now(),
      }));
      debounceUpdateLocalPost({
        id: postId,
        type,
        content: newValue,
        updatedAt: Date.now(),
      });
      return;
    },
    [debounceUpdateLocalPost, postId, localProgressExists, type]
  );

  const pubPost = async () => {
    const genreArray = genre.split(",");
    const hashtagArray = hashtags.split(" ");
    const isPublished = await publishPost(postId, {
      description,
      content,
      type,
      title: title,
      genre: genreArray,
      hashtags: hashtagArray,
    });
    isPublished && history.push("/home");
  };

  const saveToCloud = async () => {
    const genreArray = genre.split(",");
    const hashtagArray = hashtags.split(" ");
    const success = await savePostToCloud(postId, {
      content,
      type,
      title,
      hashtags: hashtagArray,
      description,
      genre: genreArray,
    });
    success && setIsOverlayHidden(true);
  };

  // Getting local storage post if available and if user wants it
  useEffect(() => {
    const localPost = getLocalUnpublishedPostById(postId);
    if (!localPost) {
      setLocalProgressExists(false);
      setLoadLocal(false);
      return;
    }
    setLocalProgressExists(true);
    if (!loadLocal) return;
    const { content, description, genre, title, hashtags, type, updatedAt } =
      localPost;
    setPostFormData({
      type,
      content: content || "",
      description: description || "",
      genre: genre ? genre.toString() : "",
      title: title || "",
      hashtags: hashtags ? hashtags.toString().replace(/,/g, " ") : "",
      updatedAt: updatedAt || 0,
    });
  }, [loadLocal, postId]);

  // Get Post from firestore if there's no local data or if user requests it
  useEffect(() => {
    if (loadLocal === true || loadLocal === null) return;
    const getPost = async () => {
      const post = await getPostById(postId);
      if (!post) return console.log("no post found");
      setPostFormData({
        type: post.type,
        title: post.title,
        content: post.content,
        hashtags: post.hashtags.toString().replace(",", " "),
        genre: post.genre.toString(),
        description: post.description,
        updatedAt: post.updatedAt,
      });

      updateLocalUnpublishedPost({
        type,
        id: postId,
        title: post.title,
        content: post.content,
        hashtags: post.hashtags,
        genre: post.genre,
        description: post.description,
        updatedAt: post.updatedAt,
      });
    };
    getPost();
  }, [getPostById, postId, loadLocal, type]);

  return (
    <div className="post edit-post container">
      {loading ? (
        <Spinner h100 />
      ) : (
        <>
          <div className="post-header">
            <div className="icon" onClick={() => history.goBack()}>
              <ArrowLeft />
            </div>
            <div className="post-header-content">
              <form className="form-control create-form">
                <div className="input-control">
                  <input
                    name="title"
                    value={title}
                    onChange={onChange}
                    type="text"
                    placeholder="Enter Title Here"
                    autoComplete="off"
                  />
                </div>
              </form>
              <p className="author">{author}</p>
            </div>
          </div>
          <div className="post-container">
            <div className="post-info">
              {updatedAt !== 0 && (
                <div className="post-info-last-updated">
                  Last Updated: {getFormattedDateString(updatedAt, "editPost")}
                </div>
              )}
              <div
                className={`post-info-description${
                  !isDescriptionHidden ? " show" : ""
                }`}
              >
                <div
                  className="post-info-description-title"
                  onClick={() => setIsDescriptionHidden(!isDescriptionHidden)}
                >
                  <p className="title">Description</p>
                  <ArrowDown />
                </div>
                <form className="description-form form-control">
                  <TextareaAutosize
                    name="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Enter Description Here"
                    autoComplete="off"
                  />
                  <input
                    name="hashtags"
                    value={hashtags}
                    type="text"
                    placeholder="#hashtag #hashtag"
                    onChange={onChange}
                    autoComplete="off"
                  />
                  <input
                    name="genre"
                    value={genre}
                    type="text"
                    placeholder="Genre"
                    onChange={onChange}
                    autoComplete="off"
                  />
                </form>
              </div>
            </div>
            <TinyEditor
              value={content}
              onContentChange={onContentChange}
              setIsOverlayHidden={setIsOverlayHidden}
              isOverlayHidden={isOverlayHidden}
            />
          </div>

          <PostEditOverlayPreviewModal
            setIsHidden={setIsPreviewModalHidden}
            isHidden={isPreviewModalHidden}
            func={() => pubPost()}
            isRequestActive={isRequestActive}
          />
          <PostEditOverlay
            isOverlayHidden={isOverlayHidden}
            setIsOverlayHidden={setIsOverlayHidden}
            setIsConfirmModalHidden={setIsPreviewModalHidden}
            saveToCloud={() => saveToCloud()}
            isRequestActive={isRequestActive}
            isSavingToCloud={isSavingToCloud}
          />
          {localProgressExists && (
            <ConfirmationDialogModal
              text="Local save detected. Do you wish to load it?"
              warning="LOCAL PROGRESS WILL BE LOST"
              isHidden={isDialogHidden}
              setIsHidden={setIsDialogHidden}
              func={() => setLoadLocal(true)}
              xFunc={() => setLoadLocal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  author: state.user.username,
  isRequestActive: state.appState.isRequestActive,
  isSavingToCloud: state.appState.isSavingToCloud,
  loading: state.posts.loading,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  publishPost: (postId: string, post: PublishPostData) =>
    dispatch(publishPost(postId, post)),
  getPostById: (postId: string) => dispatch(getPostById(postId)),
  savePostToCloud: (postId: string, postData: PublishPostData) =>
    dispatch(savePostToCloud(postId, postData)),
  setNotification: (notification: Notification) =>
    dispatch(setNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPostView);
