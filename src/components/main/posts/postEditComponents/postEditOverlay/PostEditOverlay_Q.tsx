import React from "react";
import { QNewIcon } from "../../../../helperComponents/svgIcons";

interface PostEditOverlayQProps {}

const PostEditOverlayQ: React.FC<PostEditOverlayQProps> = ({}) => {
  return (
    <button className="btn btn-neutral icon-size-16">
      <QNewIcon />
    </button>
  );
};

export default PostEditOverlayQ;
