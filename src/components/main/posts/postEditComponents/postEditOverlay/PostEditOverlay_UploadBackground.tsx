import React from "react";
import { AddItemIcon } from "../../../../helperComponents/svgIcons";

interface PostEditOverlayUploadBackgroundProps {}

const PostEditOverlayUploadBackground: React.FC<PostEditOverlayUploadBackgroundProps> =
  ({}) => {
    return (
      <button className="btn btn-secondary icon-size-12">
        <AddItemIcon />
        <div className="btn-label">Upload Backgorund</div>
      </button>
    );
  };

export default PostEditOverlayUploadBackground;
