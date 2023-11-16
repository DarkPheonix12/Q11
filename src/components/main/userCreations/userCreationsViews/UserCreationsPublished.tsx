import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useObserveIntersection } from "../../../../helperFunctions/customHooks";
import { Post, RootState, getPublishedPosts } from "../../../../redux";
import PostCard from "../../../helperComponents/postCard/PostCard";
import Spinner from "../../../helperComponents/Spinner";

interface UserCreationsPublishedProps {
  publishedPosts: Post[];
  loading: boolean;
  getPublishedPosts: () => Promise<boolean>;
}

const UserCreationsPublished: React.FC<UserCreationsPublishedProps> = ({
  publishedPosts,
  loading,
  getPublishedPosts,
}) => {
  const [lastCardDivRef] = useObserveIntersection(getPublishedPosts);

  useEffect(() => {
    if (publishedPosts.length < 1) getPublishedPosts();
  }, [publishedPosts.length, getPublishedPosts]);
  return (
    <>
      <div className="published">
        {publishedPosts.map((post, i) => (
          <PostCard
            postInfo={post}
            page="published"
            key={i}
            lastCardDivRef={
              publishedPosts.length === i + 1 ? lastCardDivRef : undefined
            }
          />
        ))}
        {loading && <Spinner />}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  publishedPosts: state.userPublishedPosts.posts,
  loading: state.userPublishedPosts.loading,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getPublishedPosts: () => dispatch(getPublishedPosts()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCreationsPublished);
