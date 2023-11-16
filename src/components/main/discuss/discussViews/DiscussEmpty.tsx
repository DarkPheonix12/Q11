import React from "react";
import { useHistory } from "react-router-dom";

const DiscussEmpty: React.FC = () => {
  const history = useHistory();
  return (
    <div className="discuss-empty">
      <div className="discuss-owl">
        <img
          src="/img/icons/discuss-owl.svg"
          alt="Discuss Owl"
          className="owl"
        />
        <img
          src="/img/icons/owl-shadow.svg"
          alt="Owl Shadow"
          className="owl-shadow"
        />
      </div>
      <h2 className="discuss-empty-title">You haven't gotten anything yet</h2>
      <div
        className="btn btn-secondary"
        onClick={() => history.push("/create-question")}
      >
        Ask a question
      </div>
    </div>
  );
};

export default DiscussEmpty;
