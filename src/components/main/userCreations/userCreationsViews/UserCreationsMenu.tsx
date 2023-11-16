import React from "react";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  PublishedIcon,
  UnpublishedIcon,
} from "../../../helperComponents/svgIcons";

const UserCreationsMenu: React.FC = () => {
  const linkPages = ["published", "unpublished"];

  return (
    <Swiper
      tag="section"
      className="sub-header your-creations-menu"
      slidesPerView={2}
      style={{ background: "#5E63A0" }}
    >
      {linkPages.map((page, i) => (
        <SwiperSlide key={i}>
          <NavLink
            to={`/home/your-creations/${page}`}
            activeClassName="current"
          >
            <div className="sub-header-item">
              {page === "published" ? <PublishedIcon /> : <UnpublishedIcon />}
            </div>
          </NavLink>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default UserCreationsMenu;
