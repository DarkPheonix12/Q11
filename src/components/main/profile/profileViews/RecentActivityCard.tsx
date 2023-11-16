import React, { useEffect, useState } from "react";
import { RecentActivitySchema } from "../../../../schemas";
import CardRating from "../../../helperComponents/postCard/CardRating";
import UserImageRounded from "../../../helperComponents/UserImageRounded";
import { getFormattedDateString } from "../../../../helperFunctions/textFormatting";
import { Link } from "react-router-dom";
import { getUserAvatarUrlById } from "../../../../helperFunctions/firebaseUserActions";

interface RecentActivityCardProps {
  activity: RecentActivitySchema;
  profileAvatar: string;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activity,
  profileAvatar,
}) => {
  const [activityUserImg, setActivityUserImage] = useState<string>("");
  useEffect(() => {
    const getUserImage = async () => {
      if (activity.type === "rated") {
        const img = await getUserAvatarUrlById(activity.createdBy.userId);
        setActivityUserImage(img);
      } else setActivityUserImage(profileAvatar);
    };

    getUserImage();
  }, [profileAvatar, activity]);
  return (
    <div className="recent-activity-card box-card">
      <div className="user-avatar">
        <UserImageRounded src={activityUserImg} />
      </div>
      <div className="activity-card-content">
        <p className="activity-type">{activity.type}</p>
        <p className="activity-title">{activity.title}</p>
        {activity.type === "published" ? (
          <div className="summary">{activity.summary}</div>
        ) : activity.type === "asked" ? (
          <Link
            to={`/home/discuss/question/${activity.id}`}
            className="view-answers"
          >
            View Answers
          </Link>
        ) : (
          <CardRating rating={activity.rating} />
        )}
        <div className="recent-activity-card-footer">
          {getFormattedDateString(activity.createdAt, "recentActivity")}
        </div>
      </div>
    </div>
  );
};

export default RecentActivityCard;
