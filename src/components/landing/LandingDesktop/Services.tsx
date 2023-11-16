import React, { useState } from "react";

const Services: React.FC = () => {
  const [features] = useState([
    {
      iconLink: "/img/desktopAssets/feature-fire.png",
      headline: "Future Ready",
      description: "The stories are never ending: one more coming every week.",
    },
    {
      iconLink: "/img/desktopAssets/feature-design.png",
      headline: "Unique Design",
      description: "Made with thinking of you at every step.",
    },
    {
      iconLink: "/img/desktopAssets/feature-limitless.png",
      headline: "Limitless",
      description:
        "Functionality to edit, write and share content without any limits.",
    },
    {
      iconLink: "/img/desktopAssets/feature-stats.png",
      headline: "Real-time Tracking",
      description: "Analyze your content. Every step. The entire way.",
    },
  ]);

  return (
    <section className="services">
      <div className="row text-center">
        {features.map((feature, i) => (
          <div key={i} className="col-12 col-md-3">
            <>
              <div className="row">
                <div className="col">
                  <img
                    src={feature.iconLink}
                    alt={feature.headline}
                    className="icon"
                  />
                  <p className="headline">{feature.headline}</p>
                </div>
              </div>
              <div className="row">
                <div className="col">{feature.description}</div>
              </div>
            </>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
