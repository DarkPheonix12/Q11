import React from "react";
import { UploadIcon } from "../../../../helperComponents/svgIcons";

interface PostEditOverlayPublishProps {
  setIsConfirmModalHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostEditOverlayPublish: React.FC<PostEditOverlayPublishProps> = ({
  setIsConfirmModalHidden,
}) => {
  return (
    <button
      className="btn btn-primary icon-size-11"
      onClick={() => setIsConfirmModalHidden(false)}
    >
      <UploadIcon />
      <div className="btn-label">Publish</div>
    </button>
  );
};

export default PostEditOverlayPublish;
