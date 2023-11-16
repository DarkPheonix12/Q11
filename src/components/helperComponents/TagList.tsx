import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { HeaderTag } from "../../types";

interface TagListProps {
  page: "home" | "library";
  tags: HeaderTag[];
}

const TagList: React.FC<TagListProps> = ({ tags, page }) => {
  return (
    <>
      <Swiper
        tag="section"
        className="tag-list"
        freeMode={true}
        speed={150}
        spaceBetween={4}
        roundLengths={true}
        slidesPerView="auto"
      >
        {tags.map((tag, i) => (
          <SwiperSlide key={i}>
            <Link
              to={tag.link || `/${page}?id=${tag.tag}`}
              className={`btn btn-round btn-tag ${
                tag.primary ? "btn-primary" : ""
              }`}
            >
              {tag.tag}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default TagList;
