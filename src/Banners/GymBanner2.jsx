import React from "react";
import Banner from "./Banner";

function GymBanner2() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <Banner
        title="Gym & Fitness"
        subtitle="Elevate your workouts with premium gear"
        image="Banner/pngtree-black-gym-with-heavy-weights-image_2687614.jpg"
        ctaText="Shop Gym"
        ctaLink="/products/gym"
      />
    </div>
  );
}

export default GymBanner2;
