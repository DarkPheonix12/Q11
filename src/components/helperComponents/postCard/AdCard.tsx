import React from "react";
import { useHistory } from "react-router-dom";
import { AdInfo } from "../../../types";

interface AdCardProps {
  ad: AdInfo;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const history = useHistory();
  return (
    <div
      className="card ad"
      onClick={() =>
        ad.adLink.match(/https:\/\//g)
          ? window.open(ad.adLink, "_blank")
          : history.push(ad.adLink || "#!")
      }
    >
      <h1 className="ad-text">{ad.adText}</h1>
    </div>
  );
};

export default AdCard;
