import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#5b21b6] to-[#8b5cf6] flex items-center justify-center px-6 py-12">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center animate-fade-in">
        <h1 className="text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-white/80 text-base md:text-lg mb-8">
          You’ve ventured into uncharted territory. But don’t worry—we’ll help
          you find your way back.
        </p>
        <Link
          to="/"
          className="inline-block bg-white text-[#5b78ff] font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Take Me Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
