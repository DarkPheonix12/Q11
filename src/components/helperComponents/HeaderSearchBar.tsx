import React, { useEffect, useRef, useState } from "react";
import { SearchIcon } from "./svgIcons";

interface HeaderSearchBarProps {
  hideSearchBar: boolean;
  toggleSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
  path?: string;
}

const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  hideSearchBar,
  toggleSearchBar,
  path,
}) => {
  const [searchValue, changeSearchValue] = useState("");

  useEffect(() => {
    const searchForm = document.querySelector(".search-form");
    const hideSearchBarOnOutsideClick = (e: MouseEvent) =>
      form &&
      form.current &&
      !form.current.contains(e.target as Node) &&
      searchForm &&
      !searchForm.contains(e.target as Node) &&
      toggleSearchBar(true);
    document.addEventListener("mousedown", hideSearchBarOnOutsideClick);
    return () =>
      document.removeEventListener("mousedown", hideSearchBarOnOutsideClick);
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(searchValue);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeSearchValue(e.target.value);
  };

  const form = useRef<HTMLFormElement>(null);
  return (
    <form
      onSubmit={(e) => onSubmit(e)}
      className={`search-form form-control ${hideSearchBar ? "" : "show"}`}
      ref={form}
    >
      <SearchIcon />
      <input
        type="text"
        className="search input-control"
        placeholder="Search books & questions"
        onChange={(e) => onChange(e)}
      />
    </form>
  );
};

export default HeaderSearchBar;
