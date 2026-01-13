import React from "react";
import Banner from "./Banner";
function CricketBanner2
() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <Banner
        title="Cricket Gear"
        subtitle="Everything you need to hit a six!"
        image="Banner/p037bmzj.jpg"
        ctaText="Shop Cricket"
        ctaLink="/products/cricket"
      />
    </div>
  );
}

export default CricketBanner2;
