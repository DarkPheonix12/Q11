import React, { useEffect, useRef } from "react";
import PostEditOverlayPublish from "./PostEditOverlay_Publish";
import PostEditOverlayQ from "./PostEditOverlay_Q";
import PostEditOverlaySaveToCloud from "./PostEditOverlay_SaveToCloud";
import PostEditOverlayUploadBackground from "./PostEditOverlay_UploadBackground";

interface PostEditOverlayProps {
  isOverlayHidden: boolean;
  isRequestActive: boolean;
  isSavingToCloud: boolean;
  setIsOverlayHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConfirmModalHidden: React.Dispatch<React.SetStateAction<boolean>>;
  saveToCloud: () => Promise<void> | void;
}

const PostEditOverlay: React.FC<PostEditOverlayProps> = ({
  isOverlayHidden,
  isRequestActive,
  isSavingToCloud,
  setIsOverlayHidden,
  setIsConfirmModalHidden,
  saveToCloud,
}) => {
  const postOverlayRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!e.target) return;
      if (e.target === postOverlayRef.current) setIsOverlayHidden(true);
    };
    document.addEventListener("click", handleClick, { passive: true });

    return () =>
      document.removeEventListener("click", handleClick, {
        passive: true,
      } as EventListenerOptions);
  }, [setIsOverlayHidden]);
  return (
    <div
      className={`post-overlay post-edit-overlay${
        isOverlayHidden ? " hide" : ""
      }`}
      ref={postOverlayRef}
    >
      <div className="post-overlay-buttons">
        <PostEditOverlayQ />
        <PostEditOverlayUploadBackground />
        <PostEditOverlaySaveToCloud
          saveToCloud={saveToCloud}
          isSavingToCloud={isSavingToCloud}
        />
        <PostEditOverlayPublish
          setIsConfirmModalHidden={setIsConfirmModalHidden}
        />
      </div>
    </div>
  );
};

export default PostEditOverlay;
