import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useObserveIntersection } from "../../../../helperFunctions/customHooks";
import { Post, RootState, getUnpublishedPosts } from "../../../../redux";
import PostCard from "../../../helperComponents/postCard/PostCard";
import Spinner from "../../../helperComponents/Spinner";

interface UserCreationsUnpublishedProps {
  unpublishedPosts: Post[];
  loading: boolean;
  getUnpublishedPosts: () => Promise<boolean>;
}

const UserCreationsUnpublished: React.FC<UserCreationsUnpublishedProps> = ({
  unpublishedPosts,
  loading,
  getUnpublishedPosts,
}) => {
  const [lastCardDivRef] = useObserveIntersection(getUnpublishedPosts);

  useEffect(() => {
    if (unpublishedPosts.length < 1) getUnpublishedPosts();
  }, [unpublishedPosts.length, getUnpublishedPosts]);
  return (
    <>
      <div className="unpublished">
        {unpublishedPosts.map((post, i) => (
          <PostCard
            postInfo={post}
            page="unpublished"
            key={i}
            lastCardDivRef={
              unpublishedPosts.length === i + 1 ? lastCardDivRef : undefined
            }
          />
        ))}
        {loading && <Spinner />}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  unpublishedPosts: state.userUnpublishedPosts.posts,
  loading: state.userUnpublishedPosts.loading,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getUnpublishedPosts: () => dispatch(getUnpublishedPosts()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCreationsUnpublished);
