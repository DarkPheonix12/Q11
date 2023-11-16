import React from "react";
import {
  formatNumbers,
  getFormattedDateString,
} from "../../../helperFunctions";
import { ViewsIcon } from "../svgIcons";
import CardRating from "./CardRating";
import firebase from "../../../firebase";

interface CardFooterProps {
  type: "story" | "book" | "blog" | "poem" | "journal" | "ad";
  page: "home" | "library" | "published" | "unpublished";
  views: number;
  rating: number[];
  dateCreated: firebase.firestore.Timestamp | number;
  dateUpdated: firebase.firestore.Timestamp | number;
  minutesRead: number;
}

const CardFooter: React.FC<CardFooterProps> = ({
  views,
  rating,
  minutesRead,
  dateCreated,
  dateUpdated,
  page,
}) => {
  return (
    <div className="card-footer">
      {page !== "published" && page !== "unpublished" && (
        <div className="card-views">
          <div className="card-views-icon">
            <ViewsIcon />
          </div>
          <span className="views">{formatNumbers(views)}</span>
        </div>
      )}
      {page !== "unpublished" && rating && (
        <CardRating rating={rating}></CardRating>
      )}
      {page === "published" && dateCreated && (
        <div className="published-footer">
          <div className="published-date">
            {getFormattedDateString(dateCreated, "cardDate")}
          </div>
          <div className="minutes-read">{minutesRead} min read</div>
        </div>
      )}

      {page === "unpublished" && dateUpdated && (
        <div className="updated-date">
          Last Updated {getFormattedDateString(dateUpdated, "cardDate")}
        </div>
      )}
    </div>
  );
};

export default CardFooter;
