import React from "react";

interface ReadingProgressProps {
  totalPages: number;
  pagesRead: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
  totalPages,
  pagesRead,
}) => {
  const calcReadingProgress = (
    pagesRead: number,
    totalPages: number
  ): number => {
    return pagesRead
      ? parseFloat((pagesRead / totalPages).toFixed(2)) * 100
      : 0;
  };
  return (
    <div className="reading-progress">
      <div className="reading-progress-container">
        <div className="reading-progress-bar"></div>
        <div
          className={`reading-progress-fill${
            pagesRead && pagesRead === totalPages ? " read" : ""
          }`}
          style={{ width: `${calcReadingProgress(pagesRead, totalPages)}%` }}
        ></div>
      </div>

      <div className="dot-seperator"></div>
      <div className="minutes-read">5 Minutes</div>
    </div>
  );
};

export default ReadingProgress;
