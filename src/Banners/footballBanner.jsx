import { useNavigate } from "react-router-dom";
import footballImage from "../assets/pexels-eslames1-31160153.jpg";

function FootballBanner() {
  const navigate = useNavigate();

  return (
    <div
      className="relative mx-3 my-6 overflow-hidden rounded-2xl"
      style={{
        backgroundImage: `url(${footballImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="bg-black/60 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-6 px-6 py-10 md:px-12 md:py-16 text-white">

          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={footballImage}
              alt="Football Gear"
              className="h-56 md:h-72 w-full max-w-md rounded-xl object-cover shadow-lg"
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
              The Ultimate Football Season is Here!
            </h1>

            <p className="mt-3 text-sm md:text-base text-gray-200">
              Gear up with official jerseys, boots, and training essentials for all leagues.
            </p>

            <button
              onClick={() => navigate("/football")}
              className="
                mt-6 inline-block rounded-md
                bg-[#420300] px-6 py-3
                text-sm font-semibold text-white
                transition-all duration-300
                hover:scale-105 hover:bg-[#5a0500]
              "
            >
              Shop Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default FootballBanner;
