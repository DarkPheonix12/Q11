import React from "react";
import { RatingStarIcon } from "../svgIcons";

interface CardRatingProps {
  rating: number[] | number;
}

const CardRating: React.FC<CardRatingProps> = ({ rating }) => {
  const getAverage = (rating: number[]): string[] => {
    const ratingTotal = rating.reduce((a, b) => a + b);
    const averageRating = ratingTotal / rating.length;
    const displayedRating = Math.round(averageRating);
    const starArray = [];

    for (let i = 0; i < displayedRating; i++) {
      starArray.push("");
    }
    return starArray;
  };

  const getStarArrayFromNumber = (rating: number): string[] => {
    const starArray = [];
    for (let i = 0; i < rating; i++) {
      starArray.push("");
    }
    return starArray;
  };
  return (
    <div className="rating-stars">
      {typeof rating === "number"
        ? getStarArrayFromNumber(rating).map((_, i) => (
            <React.Fragment key={i}>
              <RatingStarIcon />
            </React.Fragment>
          ))
        : getAverage(rating).map((_, i) => (
            <React.Fragment key={i}>
              <RatingStarIcon />
            </React.Fragment>
          ))}
    </div>
  );
};

export default CardRating;
