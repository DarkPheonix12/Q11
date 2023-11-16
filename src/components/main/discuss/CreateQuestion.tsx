import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { removeExtraSpaces } from "../../../helperFunctions";
import { getNotificationMessage } from "../../../helperFunctions/customNotificationMessages";
import { RootState, setNotification, Notification } from "../../../redux";
import { submitQuestion } from "../../../redux/questions/questionsActions";
import Spinner from "../../helperComponents/Spinner";
import { ArrowDown, CheckmarkIcon } from "../../helperComponents/svgIcons";

interface CreateQuestionProps {
  isRequestActive: boolean;
  submitQuestion: (questionData: {
    hashtags: string[];
    question: string;
  }) => Promise<boolean>;
  setNotification: typeof setNotification;
}

interface QuestionDraft {
  textAreaValue?: string;
  hashtags?: string[];
  charCount?: number;
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({
  isRequestActive,
  submitQuestion,
  setNotification,
}) => {
  const [charCount, updateCharCount] = useState<number>(0);
  const [textAreaValue, updateTextAreaValue] = useState<string>("");
  const [hashtags, updateHashtags] = useState<string[]>([]);
  useEffect(() => {
    const questionDraft = localStorage.getItem("questionDraft");
    if (questionDraft) {
      const questionInfo = JSON.parse(questionDraft);
      updateTextAreaValue(questionInfo.textAreaValue);
      updateHashtags(questionInfo.hashtags);
      updateCharCount(questionInfo.charCount);
    }
  }, []);

  const checkAndUpdateHashtags = (inputValue: string) => {
    const match = inputValue.match(/#(\w+)/g);
    if (match) {
      let newHashtags: string[] = [];
      let newInputValue = inputValue;
      match.forEach((m) => (newInputValue = newInputValue.replace(m, "")));
      const trimmedValue = removeExtraSpaces(newInputValue);
      match.forEach((m) => {
        if (!hashtags.includes(m)) newHashtags = [...newHashtags, m];
      });
      updateHashtags([...hashtags, ...newHashtags]);
      updateTextAreaValue(trimmedValue);
      updateCharCount(trimmedValue.length);
      updateLocalStorageDraft({
        textAreaValue: trimmedValue,
        charCount: trimmedValue.length,
        hashtags: [...hashtags, ...newHashtags],
      });
      return { hashtags: [...hashtags, ...newHashtags], value: trimmedValue };
    } else return { hashtags, value: textAreaValue };
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    updateTextAreaValue(e.target.value);
    updateCharCount(e.target.value.length);
    updateLocalStorageDraft({
      charCount: e.target.value.length,
      textAreaValue: e.target.value,
      hashtags,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadValue = checkAndUpdateHashtags(textAreaValue);
    uploadValue.value = uploadValue.value.trim();
    if (uploadValue.value.length > 0) {
      const questionSubmitted = await submitQuestion({
        hashtags: uploadValue.hashtags,
        question: uploadValue.value,
      });
      localStorage.removeItem("questionDraft");
      questionSubmitted && history.push("/home/discuss/all");
    } else {
      updateTextAreaValue("");
      updateCharCount(0);
      updateLocalStorageDraft({
        charCount: 0,
        textAreaValue: "",
        hashtags,
      });
      setNotification({ text: getNotificationMessage("question-empty") });
    }
  };

  const handleSpaceClick = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    let key: number | string;
    key = e.which || e.keyCode;
    if ((!key || key === 229) && textAreaRef.current) {
      const selectionStart = textAreaRef.current.selectionStart - 1;
      const selectionStartValue = selectionStart || 0;
      const char = textAreaRef.current.value.substr(selectionStartValue, 1);
      key = char.charCodeAt(0);
    }
    if (key === 32) checkAndUpdateHashtags(textAreaValue);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = e.clipboardData.getData("text");
    const match = value.match(/#(\w+)/g);
    let newInputValue = textAreaValue + value;
    match && e.preventDefault();
    match &&
      match.forEach(
        (m: string) => (newInputValue = newInputValue.replace(m, ""))
      );
    const trimmedValue = removeExtraSpaces(newInputValue);
    updateTextAreaValue(trimmedValue);
    const newHashtags = await checkAndUpdateHashtags(
      `${textAreaValue}${value}`
    );
    updateLocalStorageDraft({
      textAreaValue: trimmedValue,
      charCount: trimmedValue.length,
      hashtags: newHashtags.hashtags,
    });
  };

  const removeTag = (e: any) => {
    const index = e.target.id;
    const newHashtags = [...hashtags];
    newHashtags.splice(index, 1);
    updateHashtags(newHashtags);
    const localQuestionDraft = localStorage.getItem("questionDraft");
    localQuestionDraft
      ? updateLocalStorageDraft({
          ...JSON.parse(localQuestionDraft),
          hashtags: newHashtags,
        })
      : updateLocalStorageDraft({
          textAreaValue: "",
          charCount: 0,
          hashtags: newHashtags,
        });
  };

  const updateLocalStorageDraft = (questionDraft: QuestionDraft) => {
    const { textAreaValue, hashtags, charCount } = questionDraft;
    const localQuestionDraft = localStorage.getItem("questionDraft");
    const newQuestionDraft = localQuestionDraft
      ? JSON.parse(localQuestionDraft)
      : {};
    newQuestionDraft.textAreaValue = textAreaValue;
    newQuestionDraft.hashtags = hashtags;
    newQuestionDraft.charCount = charCount;
    localStorage.setItem("questionDraft", JSON.stringify(newQuestionDraft));
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const history = useHistory();
  return (
    <section className="create-question">
      <div className="create-question-header">
        <h1>Post a Question</h1>
        <div className="arrow-down" onClick={() => history.goBack()}>
          <ArrowDown />
        </div>
      </div>
      <form id="questionForm" onSubmit={(e) => onSubmit(e)}>
        <textarea
          name="answer"
          className="qa-textarea"
          placeholder="John, type anything..."
          maxLength={500}
          onChange={(e) => onChange(e)}
          onKeyUp={(e) => handleSpaceClick(e)}
          onPaste={(e) => handlePaste(e)}
          value={textAreaValue}
          ref={textAreaRef}
        ></textarea>
      </form>
      <div className="create-question-footer">
        <div className="hashtags">
          {hashtags.length > 0 ? (
            hashtags.map((hashtag, i) => (
              <span
                className="hashtag"
                key={i}
                id={`${i}`}
                onClick={(e) => removeTag(e)}
              >
                {hashtag}{" "}
              </span>
            ))
          ) : (
            <>
              <span className="hashtag placeholder">#Hashtag</span>{" "}
              <span className="hashtag placeholder">#Hashtag</span>{" "}
              <span className="hashtag placeholder">#Hashtag</span>
            </>
          )}
        </div>
        <div className="hashtag-elements">
          <div className="char-counter">{charCount}/500</div>
          <button
            disabled={isRequestActive}
            className="btn btn-secondary-lighter add-hashtag-button"
            type="submit"
            form="questionForm"
          >
            {isRequestActive ? <Spinner /> : <CheckmarkIcon />}
          </button>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  isRequestActive: state.appState.isRequestActive,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, Action>
) => ({
  submitQuestion: (questionData: { hashtags: string[]; question: string }) =>
    dispatch(submitQuestion(questionData)),
  setNotification: (notification: Notification) =>
    dispatch(setNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestion);
