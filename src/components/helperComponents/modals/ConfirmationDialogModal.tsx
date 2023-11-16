import React, { useEffect, useRef } from "react";
import { CheckmarkIcon, XIcon } from "../svgIcons";

interface ConfirmationDialogModalProps {
  text: string;
  warning?: string;
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  func: () => void | Promise<void | boolean | string>;
  xFunc?: () => void | Promise<void | boolean | string>;
}

const ConfirmationDialogModal: React.FC<ConfirmationDialogModalProps> = ({
  text,
  warning,
  isHidden,
  setIsHidden,
  func,
  xFunc,
}) => {
  const overlayContainerRef = useRef<HTMLDivElement | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const onXClick = () => {
    if (xFunc) xFunc();
    setIsHidden(true);
  };

  const onYesClick = () => {
    func();
    if (xFunc) setIsHidden(true);
  };

  useEffect(() => {
    if (!confirmButtonRef.current) return;
    if (!closeButtonRef.current) return;
    if (!overlayContainerRef.current) return;
    const confirmButton = confirmButtonRef.current;
    const closeButton = closeButtonRef.current;
    const overlayContainer = overlayContainerRef.current;

    !isHidden && confirmButton.focus();

    const handleClick = (e: MouseEvent) => {
      if (e.target !== overlayContainer || xFunc) return;
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
  }, [setIsHidden, isHidden, xFunc]);

  return (
    <div
      className={`modal-container${isHidden ? " hidden" : ""}`}
      ref={overlayContainerRef}
    >
      <div className="confirmation-dialog">
        <div className="confirmation-dialog-content">
          <p className="text">{text}</p>
          {warning && <p className="warning">({warning})</p>}
        </div>
        <div className="confirmation-dialog-buttons">
          <button
            className="btn btn-primary-lighter icon-size-17"
            ref={confirmButtonRef}
            onClick={onYesClick}
          >
            <CheckmarkIcon />
          </button>
          <button
            className="btn btn-primary-lighter icon-size-10"
            ref={closeButtonRef}
            onClick={onXClick}
          >
            <XIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialogModal;
