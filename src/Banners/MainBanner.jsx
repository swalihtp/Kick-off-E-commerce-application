function MainBanner() {
  return (
    <div className="m-3 rounded-2xl bg-linear-to-r from-[#1E1E1E] to-[#420300] p-6 text-white font-['Poppins'] overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT */}
        <div className="text-center md:text-left">
          <h2 className="text-lg tracking-wide">Kick-Off</h2>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Grand Slam
          </h1>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Bash
          </h1>

          <p className="mt-2 text-sm md:text-base opacity-90">
            1 to 30th SEP
          </p>
        </div>

        {/* CENTER IMAGE */}
        <div className="w-full md:w-[35%] flex justify-center">
          <img
            src="/Banner/pexels-zakaria-2827400 (1).jpg"
            alt="banner"
            className="h-48 md:h-64 rounded-xl object-cover shadow-lg"
          />
        </div>

        {/* RIGHT */}
        <div className="text-center md:text-right">
          <h2 className="text-xl md:text-2xl font-bold text-[#ffffff]">
            EXTRA 25% OFF
          </h2>

          <h2 className="text-lg md:text-xl font-semibold">
            ON EVERYTHING*
          </h2>

          <p className="mt-1 text-sm opacity-90">
            Discount auto applied at checkout
          </p>

          {/* BUTTONS */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
            <button className="rounded-md bg-white px-6 py-2 text-sm font-semibold text-black transition hover:scale-105">
              FOR HIM
            </button>

            <button className="rounded-md border border-white px-6 py-2 text-sm font-semibold transition hover:bg-white hover:text-black hover:scale-105">
              FOR HER
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MainBanner;
