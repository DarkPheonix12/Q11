import React, { useEffect, useRef, useState } from "react";
import { ProfileIcon } from "./svgIcons";

interface UserImageRoundedProps {
  src: string;
  reference?: React.RefObject<HTMLImageElement>;
  className?: string;
  alt?: string;
}

const UserImageRounded: React.FC<UserImageRoundedProps> = React.memo(
  ({ src, className, reference, alt }) => {
    const img = useRef<HTMLImageElement>(null);
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);

    useEffect(() => {
      // onload
      if (reference && reference.current)
        reference.current.onload = () => setImgLoaded(true);
      if (img.current) img.current.onload = () => setImgLoaded(true);

      // if loaded already
      if (reference && reference.current)
        reference.current.complete && setImgLoaded(true);
      if (img.current) img.current.complete && setImgLoaded(true);
    }, [src, reference]);

    return src ? (
      <>
        <img
          src={src}
          alt={alt || "User Avatar"}
          className={`user-img-rounded ${imgLoaded ? "" : "loading"} ${
            className || ""
          }`}
          ref={reference || img}
        ></img>
        {!imgLoaded && (
          <div className={`user-img-rounded default ${className || ""}`}>
            <ProfileIcon />
          </div>
        )}
      </>
    ) : (
      <div
        className={`user-img-rounded default ${className || ""}`}
        ref={reference || img}
      >
        <ProfileIcon />
      </div>
    );
  }
);

export default UserImageRounded;
