import { useNavigate } from "react-router-dom";
import gymImage from "../assets/Gym-theme.jpg";

function GymBanner() {
  const nav = useNavigate();

  return (
    <div
      className="relative mx-3 my-6 overflow-hidden rounded-2xl"
      style={{
        backgroundImage: `url(${gymImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="bg-black/60 backdrop-blur-sm">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 px-6 py-10 md:px-12 md:py-16 text-white">

          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
              Fuel Your Fitness Journey
            </h1>

            <p className="mt-3 text-sm md:text-base text-gray-200">
              Discover premium gym wear, accessories, and essentials to power your workouts.
            </p>

            <button
              onClick={() => nav("/gym")}
              className="
                mt-6 inline-block rounded-md
                bg-[#420300] px-6 py-3
                text-sm font-semibold text-white
                transition-all duration-300
                hover:scale-105 hover:bg-[#5a0500]
              "
            >
              Shop Gym Collection
            </button>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={gymImage}
              alt="Gym Gear"
              className="h-56 md:h-72 w-full max-w-md rounded-xl object-cover shadow-lg"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default GymBanner;
