import React from "react";

interface CardContentProps {
  type: "story" | "book" | "blog" | "poem" | "journal" | "ad";
  page: "home" | "library" | "published" | "unpublished";
  title: string;
  text: string;
}

const CardContent: React.FC<CardContentProps> = ({
  title,
  text,
  type,
  page,
}) => {
  return (
    <div className="card-content">
      <h1 className="card-title">{title ? title : "No Title"}</h1>
      {((page === "home" && type !== "book") || page === "unpublished") && (
        <div className="card-text">{text}</div>
      )}
    </div>
  );
};

export default CardContent;
