import React from "react";

function Banner({ title, subtitle, image, ctaText, ctaLink }) {
  return (
    <div
      className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white px-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-md md:text-lg">{subtitle}</p>}
        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            className="mt-4 inline-block bg-green-500 hover:bg-green-600 px-6 py-2 rounded font-semibold transition"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
}

export default Banner;
