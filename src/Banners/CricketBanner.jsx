import { useNavigate } from "react-router-dom";
import cricketImage from "../assets/cricket theme.jpg";

function CricketBanner() {
  const navigate = useNavigate();

  return (
    <div
      className="relative mx-3 my-6 overflow-hidden rounded-2xl"
      style={{
        backgroundImage: `url(${cricketImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="bg-black/60 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-8 px-6 py-10 md:px-12 md:py-16 text-white">

          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
              Catch the Cricket Fever – Asia Cup Specials!
            </h1>

            <p className="mt-3 text-sm md:text-base text-gray-200">
              Official bats, balls, and cricket gear for champions in the making.
            </p>

            <button
              onClick={() => navigate("/cricket")}
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

          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={cricketImage}
              alt="Cricket Gear"
              className="h-56 md:h-72 w-full max-w-md rounded-xl object-cover shadow-lg"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default CricketBanner;
