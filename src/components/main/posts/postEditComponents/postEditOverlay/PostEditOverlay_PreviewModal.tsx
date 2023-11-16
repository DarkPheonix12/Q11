import React, { useEffect, useRef, useState } from "react";
import ConfirmationDialogModal from "../../../../helperComponents/modals/ConfirmationDialogModal";
import Spinner from "../../../../helperComponents/Spinner";
import { CheckmarkIcon, XIcon } from "../../../../helperComponents/svgIcons";
import UserImageRounded from "../../../../helperComponents/UserImageRounded";

interface PostEditOverlayPreviewModalProps {
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isHidden: boolean;
  isRequestActive: boolean;
  func: () => void | Promise<void | boolean | string>;
}

const PostEditOverlayPreviewModal: React.FC<PostEditOverlayPreviewModalProps> =
  ({ setIsHidden, isHidden, isRequestActive, func }) => {
    const overlayContainerRef = useRef<HTMLDivElement | null>(null);
    const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const [isConfirmationDialogHidden, setIsConfirmationDialogHidden] =
      useState<boolean>(true);

    useEffect(() => {
      if (!confirmButtonRef.current) return;
      if (!closeButtonRef.current) return;
      if (!overlayContainerRef.current) return;
      const confirmButton = confirmButtonRef.current;
      const closeButton = closeButtonRef.current;
      const overlayContainer = overlayContainerRef.current;

      const handleClick = (e: MouseEvent) => {
        if (e.target !== overlayContainer) return;
        setIsHidden(true);
      };
      overlayContainer.addEventListener("click", handleClick);

      const focusOnHover = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.focus();
      };

      const unFocusOnMouseLeave = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.blur();
      };

      confirmButton.addEventListener("mouseenter", focusOnHover);
      confirmButton.addEventListener("mouseleave", unFocusOnMouseLeave);
      closeButton.addEventListener("mouseenter", focusOnHover);
      closeButton.addEventListener("mouseleave", unFocusOnMouseLeave);

      return () => {
        overlayContainer.removeEventListener("click", handleClick);
        confirmButton.removeEventListener("mouseenter", focusOnHover);
        confirmButton.removeEventListener("mouseleave", unFocusOnMouseLeave);
        closeButton.removeEventListener("mouseenter", focusOnHover);
        closeButton.removeEventListener("mouseleave", unFocusOnMouseLeave);
      };
    }, [setIsHidden]);

    useEffect(() => {
      if (!confirmButtonRef.current) return;
      if (!isHidden && isConfirmationDialogHidden)
        confirmButtonRef.current.focus();
    }, [isHidden, isConfirmationDialogHidden]);

    useEffect(() => {
      isHidden && setIsConfirmationDialogHidden(true);
    }, [isHidden]);

    return (
      <div
        className={`modal-container${isHidden ? " hidden" : ""}`}
        ref={overlayContainerRef}
      >
        <div className="preview-modal">
          <div className="preview-modal-header">PREVIEW</div>
          <div className="preview-modal-card card">
            <div className="card-header">
              <img
                src={"/img/cardImgs/card-example-2.svg"}
                alt=""
                className="card-img"
              />
              <div className="user-img">
                <UserImageRounded src="" className={`card-avatar`} />
              </div>
              <h2 className="card-type">book</h2>
            </div>

            <div className="card-content">
              <h1 className="card-title">{"test"}</h1>
              <div className="card-text">
                {
                  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam rem ipsam eligendi ducimus quibusdam tenetur sequi totam voluptatum, quae debitis doloremque eveniet, quas veritatis optio vitae placeat sunt minus aspernatur, error voluptatibus possimus animi deserunt! Excepturi iusto porro, unde laudantium perferendis quam, quia iste architecto reprehenderit vel harum error ut."
                }
              </div>
            </div>
          </div>
          <div className="preview-modal-buttons">
            <button
              className="btn btn-primary-lighter icon-size-17"
              ref={confirmButtonRef}
              onClick={() => setIsConfirmationDialogHidden(false)}
            >
              <CheckmarkIcon />
            </button>
            <button
              className="btn btn-primary-lighter icon-size-10"
              ref={closeButtonRef}
              onClick={() => setIsHidden(true)}
            >
              <XIcon />
            </button>
          </div>
          {isRequestActive && <Spinner />}
        </div>
        <ConfirmationDialogModal
          text="Are you sure you want to publish your work?"
          warning="YOU CANNOT EDIT AFTER PUBLISHING"
          func={func}
          setIsHidden={setIsConfirmationDialogHidden}
          isHidden={isConfirmationDialogHidden}
        />
      </div>
    );
  };

export default PostEditOverlayPreviewModal;
