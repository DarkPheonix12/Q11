import React, { useEffect, useState } from "react";
import { cardInfo } from "../../../../types";
import PostCard from "../../../helperComponents/postCard/PostCard";

interface ProfileLibraryProps {
  libData: cardInfo[];
}

const ProfileLibrary: React.FC<ProfileLibraryProps> = ({ libData }) => {
  const [libraryCount, changeLibraryCount] = useState(0);
  const [cardsToShow, changeCardsToShow] = useState(2);
  const handleLoadMore = () => {
    changeLibraryCount(libraryCount - 4 < 0 ? 0 : libraryCount - 4);
    changeCardsToShow(
      cardsToShow + 4 > libData.length - 1
        ? libData.length - 1
        : cardsToShow + 4
    );
  };

  useEffect(() => changeLibraryCount(libData.length), [libData.length]);

  return libData.length > 0 ? (
    <section className="profile-library">
      <div className="section-header">
        <p className="section-label">Profile Library</p>
        <p className="section-count" onClick={() => handleLoadMore()}>
          Load More ({libraryCount})
        </p>
      </div>
      <div className="profile-cards">
        {/* {libData.map(
          (item, i) =>
            i < cardsToShow && <Card cardInfo={item} page={"library"} key={i} />
        )} */}
      </div>
    </section>
  ) : null;
};

export default ProfileLibrary;
