import React, { useEffect, useState } from "react";
import PostCard from "../../helperComponents/postCard/PostCard";
// import FollowingRecent from "./FollowingRecent";
import TagList from "../../helperComponents/TagList";
import { HeaderTag, AdInfo } from "../../../types";
import Masonry from "react-masonry-component";
import { data } from "../randomData";
import CreateMenu from "./CreateMenu/CreateMenu";
import AdCard from "../../helperComponents/postCard/AdCard";
import { getPosts, Post, RootState } from "../../../redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { connect } from "react-redux";
import { useObserveIntersection } from "../../../helperFunctions/customHooks";
import Spinner from "../../helperComponents/Spinner";

interface HomeProps {
  posts: Post[];
  getPosts: () => Promise<boolean>;
  loading: boolean;
}

const Home: React.FC<HomeProps> = ({ posts, getPosts, loading }) => {
  // const recentPosts: recentActivityHeaderItem[] = data.recentPosts;
  const tags: HeaderTag[] = data.tags;
  const ads: AdInfo[] = data.ads;
  let positionOfAds: number = 6;
  let adIndex: number = -1;

  const [showCreateMenu, toggleCreateMenu] = useState(false);
  const [lastCardDivRef] = useObserveIntersection(getPosts);

  const withCreationsTag = (tags: HeaderTag[]): HeaderTag[] => {
    const newTags = [...tags];
    newTags.unshift({
      tag: "Your Creations",
      primary: true,
      link: "/profile/your-creation",
    });
    return newTags;
  };

  useEffect(() => {
    if (posts.length < 1) getPosts();
  }, [getPosts, posts.length]);

  return (
    <React.Fragment>
      <section className={`home${showCreateMenu ? " create-menu-open" : ""}`}>
        {/* <FollowingRecent recentPosts={recentPosts} /> */}
        <TagList tags={withCreationsTag(tags)} page={"home"} />

        <Masonry
          elementType={"section"}
          className="home-cards"
          options={{
            itemSelector: ".card",
            columnWidth: ".grid-sizer",
            percentPosition: true,
            transitionDuration: 0,
          }}
        >
          <div className="grid-sizer"></div>
          {posts.map((post, i) => {
            const adSeperator = (i + 1) / positionOfAds;
            if (
              adSeperator.toString().split(".").length === 1 &&
              ads[adIndex + 1]
            ) {
              adIndex++;
              return (
                <React.Fragment key={i}>
                  <AdCard ad={ads[adIndex]} key={ads[adIndex].adId} />
                  <PostCard
                    key={i}
                    postInfo={post}
                    page="home"
                    lastCardDivRef={
                      posts.length === i + 1 ? lastCardDivRef : undefined
                    }
                  />
                </React.Fragment>
              );
            }
            return (
              <PostCard
                key={i}
                postInfo={post}
                page="home"
                lastCardDivRef={
                  posts.length === i + 1 ? lastCardDivRef : undefined
                }
              />
            );
          })}
        </Masonry>
        {loading && <Spinner />}
      </section>
      <CreateMenu
        showCreateMenu={showCreateMenu}
        toggleCreateMenu={toggleCreateMenu}
      />
    </React.Fragment>
  );
};
const mapStateToProps = (state: RootState) => ({
  posts: state.posts.posts,
  loading: state.posts.loading,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  getPosts: () => dispatch(getPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
