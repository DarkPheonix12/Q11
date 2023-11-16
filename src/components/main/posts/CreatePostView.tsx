import React, { useEffect, useMemo, useState } from "react";
import TinyEditor from "./postEditComponents/TinyEditor";
import { ArrowDown, ArrowLeft } from "../../helperComponents/svgIcons";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import {
  CreateNewPostData,
  createNewPost,
  RootState,
  setNotification,
  Notification,
} from "../../../redux";
import TextareaAutosize from "react-textarea-autosize";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { getNotificationMessage } from "../../../helperFunctions/customNotificationMessages";
import PostEditOverlayPreviewModal from "./postEditComponents/postEditOverlay/PostEditOverlay_PreviewModal";
import {
  getLocalTempPostByType,
  updateLocalTempPost,
} from "../../../helperFunctions/localStorageActions";
import { debounce } from "../../../helperFunctions";
import { LocalTempPostData } from "../../../types";
import { PostTypes } from "../../../schemas";
import PostEditOverlay from "./postEditComponents/postEditOverlay/PostEditOverlay";

interface CreatePostViewProps {
  author: string;
  isRequestActive: boolean;
  createNewPost: (
    post: CreateNewPostData,
    publish?: boolean
  ) => Promise<boolean | string>;
  setNotification: typeof setNotification;
}

const CreatePostView: React.FC<CreatePostViewProps> = ({
  author,
  isRequestActive,
  createNewPost,
  setNotification,
}) => {
  const [isOverlayHidden, setIsOverlayHidden] = useState<boolean>(true);
  const [isConfirmModalHidden, setIsConfirmModalHidden] =
    useState<boolean>(true);
  const [isDescriptionHidden, setIsDescriptionHidden] =
    useState<boolean>(false);
  const [postType, setPostType] = useState<PostTypes | null>(null);
  const [postFormData, setPostFormData] = useState({
    description: "",
    hashtags: "",
    genre: "",
    title: "",
    content: "",
  });
  const { description, hashtags, genre, title, content } = postFormData;
  const history = useHistory();
  const params = useParams<{ postType: string }>();

  const debounceUpdateLocalPost = useMemo(
    () =>
      debounce((postUpdateData: LocalTempPostData) =>
        updateLocalTempPost(postUpdateData)
      ),
    []
  );

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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

    setPostFormData((prev) => ({ ...prev, [name]: newValue }));
    if (!postType) return;
    debounceUpdateLocalPost({
      type: postType,
      [name]: e.target.value,
    });
  };

  const onContentChange = useMemo(
    () => (newValue: string) => {
      setPostFormData((prev) => ({ ...prev, content: newValue }));
      if (!postType) return;
      debounceUpdateLocalPost({
        type: postType,
        content: newValue,
      });
      return;
    },
    [postType, debounceUpdateLocalPost]
  );

  const createPost = async (publish: boolean = false) => {
    if (!postType) return;
    const genreArray = genre.split(",");
    const hashtagArray = hashtags.split(" ");
    const postId = await createNewPost(
      {
        description,
        content,
        type: postType,
        title: title,
        genre: genreArray,
        hashtags: hashtagArray,
      },
      publish
    );
    if (!postId) {
      setIsConfirmModalHidden(true);
      setIsOverlayHidden(true);
      return;
    }
    return postId === true ? history.push("/home") : postId;
  };

  const saveToCloud = async () => {
    const postId = await createPost();
    postId && history.push(`/edit/${postId}`);
    return;
  };
  // checking post type validity
  useEffect(() => {
    if (
      params.postType !== "story" &&
      params.postType !== "book" &&
      params.postType !== "blog" &&
      params.postType !== "poem" &&
      params.postType !== "journal"
    ) {
      setNotification({ text: getNotificationMessage("invalid-post-type") });
      history.push("/home");
      return;
    }
    setPostType(params.postType || null);
  }, [params.postType, setNotification, history]);

  // Getting local storage post if available
  useEffect(() => {
    if (!postType) return;
    const localPost = getLocalTempPostByType(postType);
    if (!localPost) return;
    const { content, description, genre, title, hashtags } = localPost;
    setPostFormData({
      content: content || "",
      description: description || "",
      genre: genre ? genre.toString() : "",
      title: title || "",
      hashtags: hashtags ? hashtags.toString().replace(/,/g, " ") : "",
    });
  }, [postType]);

  return (
    <div className="post edit-post container">
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
        setIsHidden={setIsConfirmModalHidden}
        isHidden={isConfirmModalHidden}
        func={() => createPost(true)}
        isRequestActive={isRequestActive}
      />
      <PostEditOverlay
        isOverlayHidden={isOverlayHidden}
        setIsOverlayHidden={setIsOverlayHidden}
        setIsConfirmModalHidden={setIsConfirmModalHidden}
        saveToCloud={saveToCloud}
        isRequestActive={isRequestActive}
        isSavingToCloud={isRequestActive}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  author: state.user.username,
  isRequestActive: state.appState.isRequestActive,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  createNewPost: (post: CreateNewPostData, publish: boolean = false) =>
    dispatch(createNewPost(post, publish)),
  setNotification: (notification: Notification) =>
    dispatch(setNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostView);
