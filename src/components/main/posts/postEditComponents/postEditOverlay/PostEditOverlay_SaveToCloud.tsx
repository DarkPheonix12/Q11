import React from "react";
import Spinner from "../../../../helperComponents/Spinner";
import { SaveToCloudIcon } from "../../../../helperComponents/svgIcons";

interface PostEditOverlaySaveToCloudProps {
  saveToCloud: () => Promise<void> | void;
  isSavingToCloud: boolean;
}

const PostEditOverlaySaveToCloud: React.FC<PostEditOverlaySaveToCloudProps> = ({
  isSavingToCloud,
  saveToCloud,
}) => {
  return (
    <button
      className="btn btn-secondary icon-size-17"
      onClick={() => saveToCloud()}
      disabled={isSavingToCloud}
    >
      {isSavingToCloud ? <Spinner /> : <SaveToCloudIcon />}
      <div className="btn-label">Cloud Save</div>
    </button>
  );
};

export default PostEditOverlaySaveToCloud;
