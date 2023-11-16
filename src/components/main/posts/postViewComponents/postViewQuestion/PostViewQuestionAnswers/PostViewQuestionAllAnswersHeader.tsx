import React from "react";
import { useHistory } from "react-router";
import {
  ArrowLeft,
  QuestionMarkIcon,
} from "../../../../../helperComponents/svgIcons";

const PostHeader: React.FC = () => {
  const history = useHistory();
  return (
    <section className="question-answers-header">
      <div className="icon" onClick={history.goBack}>
        <ArrowLeft />
      </div>
      <div className="icon">
        <QuestionMarkIcon />
      </div>
    </section>
  );
};

export default PostHeader;
