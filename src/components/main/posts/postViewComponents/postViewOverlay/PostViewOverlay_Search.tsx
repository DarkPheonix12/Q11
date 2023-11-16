import DOMPurify from "dompurify";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "../../../../../helperFunctions";
import { useHideOnOutsideElementClick } from "../../../../../helperFunctions/customHooks";
import {
  ArrowDown,
  SearchIcon,
  XIcon,
} from "../../../../helperComponents/svgIcons";

interface PostViewOverlaySearchProps {
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  contentElement: React.MutableRefObject<HTMLDivElement | null>;
  scrollToElement: (element: HTMLElement) => void;
}

const PostViewOverlaySearch: React.FC<PostViewOverlaySearchProps> = ({
  isHidden,
  setIsHidden,
  contentElement,
  scrollToElement,
}) => {
  const searchElementRef = useRef<HTMLDivElement | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [numOfMatches, setNumOfMatches] = useState<number>(0);
  const [currentMatch, setCurrentMatch] = useState<number>(0);
  const [matchedElements, setMatchedElements] = useState<HTMLElement[]>([]);
  useHideOnOutsideElementClick(searchElementRef, setIsHidden);

  const debouncedSetSearchTerm = useMemo(
    () => debounce((searchValue: string) => setSearchTerm(searchValue), 200),
    []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSetSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearchTerm("");
  };

  const scrollToNextElement = () => {
    if (currentMatch === numOfMatches) return;
    const nextElementIndex = currentMatch;
    matchedElements[nextElementIndex - 1].classList.remove("active");
    matchedElements[nextElementIndex].classList.add("active");
    scrollToElement(matchedElements[nextElementIndex]);
    setCurrentMatch((prev) => prev + 1);
  };

  const scrollToPreviousElement = () => {
    if (currentMatch <= 1) return;
    const prevElementIndex = currentMatch - 2;
    matchedElements[prevElementIndex + 1].classList.remove("active");
    matchedElements[prevElementIndex].classList.add("active");
    scrollToElement(matchedElements[prevElementIndex]);
    setCurrentMatch((prev) => prev - 1);
  };

  useEffect(() => {
    if (!contentElement.current) return;
    if (contentElement.current.children.length === 0) return;

    const markedElements: HTMLElement[] = [];
    let numOfMatches: number = 0;
    const children = contentElement.current.children;

    const addMatches = () => numOfMatches++;

    for (let i = 0; i < children.length; i++) {
      const innerHTML = children[i].innerHTML;
      let newInnerHTML: string = innerHTML.replace(
        /<mark>|<mark class>|<mark class="active">|<\/mark>/g,
        ""
      );
      const sanitizedSearchTerm = searchTerm.replace(
        /[#-.]|[[-^]|[?|{}]/g,
        "\\$&"
      );
      const regex = new RegExp(sanitizedSearchTerm, "gi");
      const match = newInnerHTML.match(regex);

      if (searchTerm.length <= 1 || !match) {
        children[i].innerHTML = DOMPurify.sanitize(newInnerHTML, {
          ALLOWED_TAGS: [],
        });
        continue;
      }
      match.forEach(() => addMatches());

      const uniqueMatch = match.filter(
        (value, index, self) => self.indexOf(value) === index
      );

      uniqueMatch.forEach((m) => {
        const regex = new RegExp(`${m}`, "g");
        newInnerHTML = newInnerHTML.replace(regex, `<mark>${m}</mark>`);
      });

      children[i].innerHTML = DOMPurify.sanitize(newInnerHTML, {
        ALLOWED_TAGS: ["mark"],
      });
      // add all marked elements to the array
      children[i]
        .querySelectorAll("mark")
        .forEach((mark) => markedElements.push(mark));
    }

    if (markedElements.length > 0) {
      scrollToElement(markedElements[0]);
      setCurrentMatch(1);
      setMatchedElements(markedElements);
      setNumOfMatches(numOfMatches);
      markedElements[0].classList.add("active");
    } else {
      setCurrentMatch(0);
      setMatchedElements([]);
      setNumOfMatches(0);
    }
  }, [searchTerm, contentElement, scrollToElement]);
  return (
    <div
      className={`post-overlay-search${isHidden ? " hide" : ""}`}
      ref={searchElementRef}
    >
      <form
        className="post-search-form form-control"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="input-control">
          <div className="icon search">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleChange}
          />
          {searchValue.length > 0 && (
            <div className="x-icon" onClick={clearSearch}>
              <XIcon />
            </div>
          )}
          {searchTerm.length > 1 && (
            <div className="match">
              <div className="match-status">
                {currentMatch}/{numOfMatches}
              </div>
              <div className="match-buttons">
                <div
                  className="btn btn-secondary match-buttons-up"
                  onClick={scrollToPreviousElement}
                >
                  <ArrowDown />
                </div>
                <div
                  className="btn btn-secondary match-buttons-down"
                  onClick={scrollToNextElement}
                >
                  <ArrowDown />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostViewOverlaySearch;
