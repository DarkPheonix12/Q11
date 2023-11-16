import React from "react";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { RatingStarIcon, PeopleIcon } from "../../../helperComponents/svgIcons";

const ProfileFollowersMenu: React.FC = () => {
  const linkPages = ["followers", "following"];

  return (
    <Swiper
      tag="section"
      className="sub-header"
      slidesPerView={2}
      style={{ background: "#5E63A0" }}
    >
      {linkPages.map((page, i) => (
        <SwiperSlide key={i}>
          <NavLink
            to={`/home/profile/follow/${page}`}
            activeClassName="current"
          >
            <div className="sub-header-item">
              {page === "followers" ? <RatingStarIcon /> : <PeopleIcon />}
            </div>
          </NavLink>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProfileFollowersMenu;
