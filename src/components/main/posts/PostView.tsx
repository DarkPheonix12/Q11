import React, { useCallback, useEffect, useRef, useState } from "react";
import { CreationsIcon } from "../../helperComponents/svgIcons";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { getPostById, RootState, Post as PostState } from "../../../redux";
import { Action } from "redux";
import Spinner from "../../helperComponents/Spinner";
import PostViewOverlay from "./postViewComponents/postViewOverlay/PostViewOverlay";
import "overlayscrollbars/css/OverlayScrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { sanitizePostContent, throttle } from "../../../helperFunctions";
import PostInfo from "./postViewComponents/PostInfo";
import PostHeader from "./postViewComponents/PostHeader";
import { LocalPostViewSettings } from "../../../types";
import PostViewQuestionOverlay from "./postViewComponents/postViewQuestion/PostViewQuestionOverlay";
import { PostQuestion } from "../../../redux/postQuestionAnswers/postQuestionAnswersTypes";
import {
  setIsPostQuestionOverlayHidden,
  setPostQuestionOverlayId,
} from "../../../redux/postQuestionOverlay/postQuestionOverlayActions";
import { populatePostQuestions } from "../../../redux/postQuestionAnswers/postQuestionAnswersActions";
import { checkIfCreatorIsCurrentUser } from "../../../helperFunctions/firebaseUserActions";

interface PostProps {
  loading: boolean;
  isQuestionOverlayHidden: boolean;
  getPostById: (postId: string) => Promise<false | PostState>;
  populatePostQuestions: (postQuestion: PostQuestion[]) => void;
  setIsPostQuestionOverlayHidden: (isHidden: boolean) => void;
  setPostQuestionOverlayId: (questionId: string) => void;
}

const PostView: React.FC<PostProps> = ({
  loading,
  isQuestionOverlayHidden,
  getPostById,
  populatePostQuestions,
  setIsPostQuestionOverlayHidden,
  setPostQuestionOverlayId,
}) => {
  const [isDescriptionHidden, setIsDescriptionHidden] = useState<boolean>(true);
  const [isOverlayHidden, setIsOverlayHidden] = useState<boolean>(true);
  const [isScrollbarHovered, setIsScrollbarHovered] = useState<boolean>(false);
  const [isScrollbarHandleClicked, setIsScrollbarHandleClicked] =
    useState<boolean>(false);
  const [prevScrollPosition, setPrevScrollPosition] = useState<number>(0);
  const [isTransitionActive, setIsTransitionActive] = useState<boolean>(false);
  const [isSOHidden, setIsSOHidden] = useState<boolean>(true);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [hideSOTimeout, setHideSOTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [postInfoHeight, setPostInfoHeight] = useState<number>(0);
  const [postInfoMargin, setPostInfoMargin] = useState<number>(0);
  const [scrollHostHeight, setScrollHostHeight] = useState<number>(0);
  const [scrollProgressBarHeight, setScrollProgressBarHeight] =
    useState<number>(0);
  const [isOSInitialized, setIsOSInitialized] = useState<boolean>(false);

  const [questionElements, setQuestionElements] = useState<Element[]>([]);

  const [postColor, setPostBackgroundColor] = useState<
    null | "gray" | "yellow" | "dark"
  >(null);
  const [fontSize, setFontSize] = useState<
    LocalPostViewSettings["fontSize"] | null
  >(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [post, setPost] = useState<PostState>({
    createdBy: {
      userId: "",
      userAvatar: "",
    },
    id: "",
    isBookmarked: false,
    type: "story",
    author: "",
    title: "",
    img: "",
    content: "",
    contentSnippet: "",
    description: "",
    views: 0,
    hashtags: [],
    isPublished: false,
    publishedAt: null,
    isPrivate: false,
    averageRating: 0,
    numberOfRatings: 0,
    numberOfShares: 0,
    numberOfBookmarks: 0,
    estimatedTimeToRead: 0,
    createdAt: 0,
    updatedAt: 0,
    genre: [""],
  });

  const postContentDiv = useRef<HTMLDivElement | null>(null);
  const postContentTextDiv = useRef<HTMLDivElement | null>(null);
  const OSRef = useRef<OverlayScrollbarsComponent | null>(null);
  const postRef = useRef<HTMLDivElement | null>(null);
  const postInfoRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressBarRef = useRef<HTMLDivElement | null>(null);
  const paramPostId = useParams<{ postId: string }>().postId;

  const scrollToElement = (element: HTMLElement) => {
    if (!OSRef.current) return;
    const OSInstance = OSRef.current.osInstance();
    OSInstance.scroll(element);
  };

  const adjustPostInfoHeight = useCallback(() => {
    if (!post.id) return;
    if (!postInfoRef.current) return;
    if (!document.defaultView) return;
    const postInfoRefHeight = parseInt(
      document.defaultView
        .getComputedStyle(postInfoRef.current, "")
        .getPropertyValue("height")
    );

    const postInfoRefMargin =
      parseInt(
        document.defaultView
          .getComputedStyle(postInfoRef.current, "")
          .getPropertyValue("margin-top")
      ) +
      parseInt(
        document.defaultView
          .getComputedStyle(postInfoRef.current, "")
          .getPropertyValue("margin-bottom")
      );

    setPostInfoHeight(postInfoRefHeight);
    setPostInfoMargin(postInfoRefMargin);
  }, [post.id]);

  // Get Post
  useEffect(() => {
    const getPost = async () => {
      const post = await getPostById(paramPostId);
      post ? setPost(post) : console.log("no post found");
    };
    if (!post.id) getPost();
    post.id && setIsOwner(checkIfCreatorIsCurrentUser(post.createdBy.userId));
  }, [getPostById, post.id, paramPostId, post.createdBy.userId]);

  // DOMPurify and instert post content into content div.
  // Add click listeners to questions.
  useEffect(() => {
    if (!postContentTextDiv.current) return;
    if (questionElements.length !== 0) return;
    postContentTextDiv.current.innerHTML = sanitizePostContent(post.content);
    const questionElementRefs = postContentTextDiv.current.querySelectorAll(
      "*[data-question-id]"
    );
    if (questionElementRefs.length === 0) return;

    const handleClickRefs: (() => void)[] = [];
    const newQuestionElements: Element[] = [];
    const postQuestions: PostQuestion[] = [];
    questionElementRefs.forEach((element) => {
      newQuestionElements.push(element);
      const questionId = element.getAttribute("data-question-id");
      const text = element.textContent;
      if (!questionId || !text) return;
      postQuestions.push({
        text: text.split("Q: ")[1],
        questionId,
        answers: [],
        hasMoreAnswers: true,
        lastAnswerDocRef: null,
        createdBy: { userId: post.createdBy.userId },
      });

      const handleClick = () => {
        setIsPostQuestionOverlayHidden(false);
        setPostQuestionOverlayId(questionId);
      };
      handleClickRefs.push(handleClick); // storing function refs so i can remove listeners
      element.addEventListener("click", handleClick);
    });
    populatePostQuestions(postQuestions);
    setQuestionElements(newQuestionElements);

    return () =>
      questionElements.forEach((element, i) => {
        const questionId = element.getAttribute("data-question-id");
        if (!questionId) return;
        element.removeEventListener("click", handleClickRefs[i]);
      });
  }, [
    post.content,
    populatePostQuestions,
    post.createdBy.userId,
    questionElements,
    setIsPostQuestionOverlayHidden,
    setPostQuestionOverlayId,
  ]);

  // Overlay and scrollbar visibility on click event listener
  useEffect(() => {
    if (loading) return;
    if (!isOSInitialized) return;
    if (isScrolling) return;
    if (!OSRef.current) return;
    const OSInstance = OSRef.current.osInstance();
    const hostRef = OSInstance.getElements().host;

    const handleOverlayClick = (e: MouseEvent) => {
      let pass = true;
      // if question is clicked don't open post overlay
      questionElements.forEach((el) => {
        if (e.target === el) pass = false;
      });
      if (!pass) return;
      if (hideSOTimeout) clearTimeout(hideSOTimeout);
      setIsOverlayHidden(false);
      setIsSOHidden(false);
      OSInstance.options({
        scrollbars: { autoHide: "never" },
      });
    };

    hostRef.addEventListener("click", handleOverlayClick);

    return () => hostRef.removeEventListener("click", handleOverlayClick);
  }, [
    setIsOverlayHidden,
    hideSOTimeout,
    isScrolling,
    questionElements,
    isOSInitialized,
    loading,
  ]);

  // ScrollbarOverlay custom event listeners
  useEffect(() => {
    if (!isOSInitialized) return;
    if (!OSRef.current) return;
    if (!document.defaultView) return;
    if (!postInfoRef.current) return;
    const OSInstance = OSRef.current.osInstance();
    const OSElements = OSInstance.getElements();
    const hostRef = OSElements.host;

    if (scrollHostHeight === 0) setScrollHostHeight(hostRef.clientHeight);
    if (postInfoHeight === 0) adjustPostInfoHeight();

    const onScroll = throttle(() => {
      if (!postInfoRef.current) return;
      if (!postContentDiv.current) return;
      // set scrolling to true
      setIsScrolling(true);
      // clear additional scroll overlay element timeout
      if (hideSOTimeout) clearTimeout(hideSOTimeout);
      // show the rest of the scrollbar elements.
      setIsSOHidden(false);
      // Updates Progress Bar
      setScrollProgressBarHeight(
        (OSInstance.scroll().position.y / OSInstance.scroll().max.y) * 100
      );
      const currentScrollPosition = OSInstance.scroll().position.y;
      // calculates max height of host scroll element
      const maxHostHeight =
        scrollHostHeight + postInfoHeight + postInfoMargin / 1.5;
      // Checks if transition active - if this runs while transition is active it bugs out when scrolled all the way down
      if (isTransitionActive) return;
      // hide .post-info, pull text up, and increase height of the host element. Hide description if shown
      if (currentScrollPosition > prevScrollPosition) {
        postInfoRef.current.style.top = `-${postInfoHeight + postInfoMargin}px`;
        postInfoRef.current.style.marginBottom = `-${
          postInfoHeight + postInfoMargin / 2
        }px`;
        hostRef.style.height = `${maxHostHeight}px`;
        !isDescriptionHidden && setIsDescriptionHidden(true);
        if (scrollDirection === "up") {
          setIsTransitionActive(true);
          setTimeout(() => setIsTransitionActive(false), 300);
          setScrollDirection("down");
        }
      }

      // show .post-info and increase height of the host element
      if (currentScrollPosition < prevScrollPosition) {
        postInfoRef.current.style.top = `0`;
        postInfoRef.current.style.marginBottom = `${postInfoMargin / 2}px`;
        hostRef.style.height = `${scrollHostHeight}px`;
        if (scrollDirection === "down") {
          setIsTransitionActive(true);
          setTimeout(() => setIsTransitionActive(false), 300);
          setScrollDirection("up");
        }
      }

      setPrevScrollPosition(OSInstance.scroll().position.y);
    }, 15);

    const onHostSizeChanged = () => {
      // Updates Progress Bar when host size changes
      setScrollProgressBarHeight(
        (OSInstance.scroll().position.y / OSInstance.scroll().max.y) * 100
      );
    };

    const onScrollStop = () => {
      setIsScrolling(false);
      if (!isScrollbarHovered && !isScrollbarHandleClicked) {
        const isSOHiddenTimeout = setTimeout(() => setIsSOHidden(true), 800);
        setHideSOTimeout(isSOHiddenTimeout);
      }
    };

    const onOverflowAmountChanged = () => {
      if (isOverlayHidden) return;
      if (!scrollProgressBarRef.current) return;
      OSInstance.options({
        scrollbars: { autoHide: "never" },
      });

      scrollProgressBarRef.current.style.height = `${
        (OSInstance.scroll().position.y / OSInstance.scroll().max.y) * 100
      }%`;
    };

    OSInstance.options({
      callbacks: {
        onScroll,
        onHostSizeChanged,
        onScrollStop,
        onOverflowAmountChanged,
      },
    });
  }, [
    prevScrollPosition,
    scrollHostHeight,
    isTransitionActive,
    isOverlayHidden,
    isScrollbarHandleClicked,
    isScrollbarHovered,
    adjustPostInfoHeight,
    hideSOTimeout,
    isDescriptionHidden,
    postInfoHeight,
    postInfoMargin,
    scrollDirection,
    isOSInitialized,
  ]);

  // Event Listeners for the overlay/scrollbar
  useEffect(() => {
    if (!isOSInitialized) return;
    if (!OSRef.current) return;
    const OSInstance = OSRef.current.osInstance();
    const OSElements = OSInstance.getElements();
    const scrollbarVertical = OSElements.scrollbarVertical.scrollbar;
    const scrollbarHandle = OSElements.scrollbarVertical.handle;

    const handleMouseLeave = () => {
      const isSOHiddenTimeout = setTimeout(() => setIsSOHidden(true), 800);
      setHideSOTimeout(isSOHiddenTimeout);
      setIsScrollbarHovered(false);
    };

    const handleMouseEnter = () => {
      hideSOTimeout && clearTimeout(hideSOTimeout);
      setIsScrollbarHovered(true);
      setIsSOHidden(false);
    };

    const handleMouseDown = () => {
      setIsScrollbarHandleClicked(true);
      hideSOTimeout && clearTimeout(hideSOTimeout);
    };

    const handleMouseUp = () => {
      isScrollbarHandleClicked && setIsScrollbarHandleClicked(false);
      if (!isScrollbarHovered) {
        const isSOHiddenTimeout = setTimeout(() => setIsSOHidden(true), 800);
        setHideSOTimeout(isSOHiddenTimeout);
      }
      setIsOverlayHidden(true);
    };

    isOverlayHidden &&
      scrollbarVertical.addEventListener("mouseenter", handleMouseEnter);
    isOverlayHidden &&
      scrollbarVertical.addEventListener("mouseleave", handleMouseLeave);
    scrollbarHandle.addEventListener("mousedown", handleMouseDown);
    scrollbarHandle.addEventListener("touchstart", handleMouseDown, {
      passive: true,
    });
    isScrollbarHandleClicked &&
      document.addEventListener("mouseup", handleMouseUp);
    isScrollbarHandleClicked &&
      document.addEventListener("touchend", handleMouseUp);

    return () => {
      scrollbarVertical.removeEventListener("mouseenter", handleMouseEnter);
      scrollbarVertical.removeEventListener("mouseleave", handleMouseLeave);
      scrollbarHandle.removeEventListener("mousedown", handleMouseDown);
      scrollbarHandle.removeEventListener("touchstart", handleMouseDown, {
        passive: true,
      });
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [
    hideSOTimeout,
    isScrollbarHandleClicked,
    isOverlayHidden,
    isScrollbarHovered,
    isOSInitialized,
  ]);

  // timeout cleanup
  useEffect(
    () => () => hideSOTimeout ? clearTimeout(hideSOTimeout) : undefined,
    [hideSOTimeout]
  );
  return (
    <>
      {!loading ? (
        <>
          <section
            className={`post${postColor ? ` ${postColor}` : ""}${
              !isQuestionOverlayHidden ? " question-overlay-open" : ""
            }`}
            ref={postRef}
          >
            <PostHeader author={post.author} title={post.title} />
            <div className="post-container">
              <PostInfo
                description={post.description}
                estimatedTimeToRead={post.estimatedTimeToRead}
                hashtags={post.hashtags}
                views={post.views}
                genre={post.genre}
                isDescriptionHidden={isDescriptionHidden}
                setIsDescriptionHidden={setIsDescriptionHidden}
                postInfoRef={postInfoRef}
              />
              <section className="post-content" ref={postContentDiv}>
                <OverlayScrollbarsComponent
                  style={{ height: "calc(100vh - 13em)" }}
                  options={{
                    scrollbars: { autoHide: "scroll" },
                    overflowBehavior: { x: "hidden" },
                    callbacks: {
                      onInitialized: () => setIsOSInitialized(true),
                    },
                  }}
                  className={"os-theme-round-dark"}
                  ref={OSRef}
                >
                  <div
                    className="post-text"
                    ref={postContentTextDiv}
                    style={{ fontSize: fontSize ? fontSize : 15 }}
                  ></div>
                </OverlayScrollbarsComponent>
                <div
                  className={`icon icon-size-15${isSOHidden ? " hide" : ""}`}
                >
                  <CreationsIcon />
                </div>
                <div
                  className={`scrollbar-progress-vertical${
                    isSOHidden ? " hide" : ""
                  }`}
                >
                  <div
                    className="scroll-progress-bar"
                    style={{ height: `${scrollProgressBarHeight}%` }}
                    ref={scrollProgressBarRef}
                  ></div>
                </div>
                <PostViewOverlay
                  isOverlayHidden={isOverlayHidden}
                  setIsOverlayHidden={setIsOverlayHidden}
                  setIsSOHidden={setIsSOHidden}
                  setPostBackgroundColor={setPostBackgroundColor}
                  contentElement={postContentTextDiv}
                  scrollToElement={scrollToElement}
                  setFontSize={setFontSize}
                  fontSize={fontSize}
                  postRef={postRef}
                />
              </section>
            </div>
          </section>

          <PostViewQuestionOverlay postId={paramPostId} isOwner={isOwner} />
        </>
      ) : (
        <div className="loading-post">
          <Spinner />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.posts.loading,
  isQuestionOverlayHidden: state.postQuestionOverlay.isHidden,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getPostById: (postId: string) => dispatch(getPostById(postId)),
  setIsPostQuestionOverlayHidden: (isHidden: boolean) =>
    dispatch(setIsPostQuestionOverlayHidden(isHidden)),
  setPostQuestionOverlayId: (questionId: string) =>
    dispatch(setPostQuestionOverlayId(questionId)),
  populatePostQuestions: (postQuestions: PostQuestion[]) =>
    dispatch(populatePostQuestions(postQuestions)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
