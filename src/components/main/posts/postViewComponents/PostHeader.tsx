import React from "react";
import { useHistory } from "react-router";
import {
  ArrowLeft,
  QuestionMarkIcon,
} from "../../../helperComponents/svgIcons";

interface PostHeaderProps {
  title: string;
  author: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ title, author }) => {
  const history = useHistory();
  return (
    <section className="post-header">
      <div className="icon" onClick={history.goBack}>
        <ArrowLeft />
      </div>
      <div className="post-header-content">
        <h2 className="title">{title}</h2>
        <p
          className="author"
          onClick={() => history.push(`/home/user/${author}`)}
        >
          {author}
        </p>
      </div>
      <div className="icon">
        <QuestionMarkIcon />
      </div>
    </section>
  );
};

export default PostHeader;
