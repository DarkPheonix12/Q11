import React, { useEffect, useRef, useState } from "react";
import CreateMenuButton from "./CreateMenuButton";
import {
  BookIcon,
  CalendarIcon,
  CreationsIcon,
  GlobeIcon,
  TextIcon,
} from "../../../helperComponents/svgIcons";

interface CreateMenuProps {
  showCreateMenu: boolean;
  toggleCreateMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateMenu: React.FC<CreateMenuProps> = ({
  showCreateMenu,
  toggleCreateMenu,
}) => {
  const createMenu = useRef<HTMLDivElement>(null);
  const menuToggleButton = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hideMenuOnOutsideClick = (e: any) => {
      if (
        createMenu &&
        createMenu.current &&
        !createMenu.current.contains(e.target) &&
        menuToggleButton &&
        menuToggleButton.current &&
        !menuToggleButton.current.contains(e.target)
      ) {
        toggleCreateMenu(false);
      }
    };

    document.addEventListener("mousedown", hideMenuOnOutsideClick);
    return () =>
      document.removeEventListener("mousedown", hideMenuOnOutsideClick);
  }, [toggleCreateMenu]);

  const [menuButtons] = useState([
    { text: "story", link: "/create/story", icon: <CreationsIcon /> },
    { text: "journal", link: "/create/journal", icon: <CalendarIcon /> },
    { text: "book", link: "/create/book", icon: <BookIcon /> },
    { text: "poem", link: "/create/poem", icon: <TextIcon /> },
    { text: "blog", link: "/create/blog", icon: <GlobeIcon /> },
  ]);

  return (
    <>
      <div
        className={`create-menu ${showCreateMenu ? " open" : ""}`}
        ref={createMenu}
      >
        <div className="create-menu-buttons">
          {menuButtons.map((button, i) => (
            <CreateMenuButton
              key={i}
              text={button.text}
              link={button.link}
              icon={button.icon}
            />
          ))}
        </div>
      </div>
      <div
        className={`toggle-create-menu-button${showCreateMenu ? " open" : ""}`}
        onClick={() => toggleCreateMenu(!showCreateMenu)}
        ref={menuToggleButton}
      ></div>
    </>
  );
};

export default CreateMenu;
