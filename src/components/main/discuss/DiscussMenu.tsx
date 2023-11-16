import React from "react";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  GlobeIcon,
  ImpactsIcon,
  SavedIcon,
  QuriosityIcon,
} from "../../helperComponents/svgIcons";

const DiscussMenu: React.FC = () => {
  const linkPages = ["all", "impacts", "quriosity", "saved"];
  return (
    <Swiper
      tag="section"
      className="sub-header"
      freeMode={true}
      speed={150}
      roundLengths={true}
      slidesPerView="auto"
      style={{ background: "#51579a" }}
    >
      {linkPages.map((page, i) => (
        <SwiperSlide key={i}>
          <NavLink to={`/home/discuss/${page}`} activeClassName="current">
            <div className="sub-header-item">
              {page === "all" ? (
                <GlobeIcon />
              ) : page === "impacts" ? (
                <ImpactsIcon />
              ) : page === "quriosity" ? (
                <QuriosityIcon />
              ) : (
                <SavedIcon />
              )}
              <p className="sub-header-icon-text">{page}</p>
            </div>
          </NavLink>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default DiscussMenu;
