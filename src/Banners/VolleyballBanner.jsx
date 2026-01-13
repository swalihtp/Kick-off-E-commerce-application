import React from "react";
import Banner from "./Banner";

function VolleyballBanner() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <Banner
        title="Volleyball Collection"
        subtitle="Get the best volleyball gear for your team!"
        image="Banner/GettyImages-591.jpg"
        ctaText="Shop Volleyball"
        ctaLink="/products/volleyball"
      />
    </div>
  );
}

export default VolleyballBanner;
