import React from "react";
import { HeaderTag } from "../../../types";
import TagList from "../../helperComponents/TagList";

interface LibraryProps {}

const Library: React.FC<LibraryProps> = ({}) => {
  const tags: HeaderTag[] = [
    { tag: "Recently Read", primary: true },
    { tag: "q" },
    { tag: "saved" },
  ];
  return (
    <React.Fragment>
      <section className="library">
        <TagList tags={tags} page={"library"} />
        <section className="library-cards">
          {/* {cards.map((card, i) => (
            <Card cardInfo={card} page="library" key={i} />
          ))} */}
        </section>
      </section>
    </React.Fragment>
  );
};

export default Library;
