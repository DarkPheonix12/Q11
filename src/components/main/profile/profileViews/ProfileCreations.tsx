import React, { useEffect, useState } from "react";
import { cardInfo } from "../../../../types";
import PostCard from "../../../helperComponents/postCard/PostCard";

interface ProfileCreationsProps {
  libData: cardInfo[];
}

const ProfileCreations: React.FC<ProfileCreationsProps> = ({ libData }) => {
  const [creationCount, changeCreationCount] = useState(0);
  const [cardsToShow, changeCardsToShow] = useState(2);
  const handleLoadMore = () => {
    changeCreationCount(creationCount - 4 < 0 ? 0 : creationCount - 4);
    changeCardsToShow(
      cardsToShow + 4 > libData.length - 1
        ? libData.length - 1
        : cardsToShow + 4
    );
  };

  useEffect(() => changeCreationCount(libData.length), [libData.length]);
  return (
    <section className="profile-creations">
      <div className="section-header">
        <p className="section-label">Creations</p>
        <p className="section-count" onClick={() => handleLoadMore()}>
          Load More ({creationCount})
        </p>
      </div>
      <div className="profile-cards">
        {/* {libData.map(
          (item, i) =>
            i < cardsToShow && <Card cardInfo={item} page={"library"} key={i} />
        )} */}
      </div>
    </section>
  );
};

export default ProfileCreations;
