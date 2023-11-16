import React from "react";
import { useHistory } from "react-router-dom";

const AddQuestionButton: React.FC = () => {
  const history = useHistory();
  return (
    <div
      className="add-question-button"
      onClick={() => history.push("/create-question")}
    ></div>
  );
};

export default AddQuestionButton;
