import React from "react";
import { Link } from "react-router-dom";
import UserImageRounded from "../../helperComponents/UserImageRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { recentActivityHeaderItem } from "../../../types";

interface FollowingRecentProps {
  recentPosts: recentActivityHeaderItem[];
}

const FollowingRecent: React.FC<FollowingRecentProps> = ({ recentPosts }) => {
  return (
    <>
      <Swiper
        tag={"section"}
        className="following-recent-activity"
        id="main"
        freeMode={true}
        spaceBetween={17}
        speed={150}
        slidesPerView={"auto"}
      >
        {recentPosts.map((post, i) => (
          <SwiperSlide key={i}>
            <Link
              to={
                post.questionId
                  ? `/question?${post.questionId}`
                  : `/post?${post.postId}`
              }
              key={i}
            >
              <UserImageRounded src={post.publisherAvatar} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default FollowingRecent;
