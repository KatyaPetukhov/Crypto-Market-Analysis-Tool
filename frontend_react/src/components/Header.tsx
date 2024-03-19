import React from "react";

const Header = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="container mx-auto flex items-center">
          <a className="h-14 w-14 mr-4" href="index.html">
            <img src="img/logo/logo.svg" alt="logo" />
          </a>

          <a
            className="hidden md:block font-bold text-indigo-800 text-xl"
            href="index.html"
          >
            Crypto Market Analysis Tool
          </a>
        </div>
        <div className="flex">
          <a
            className="text-gray-800 hover:text-gray-600 px-3"
            href="index.html"
          >
            Home
          </a>
          <a
            className="text-gray-800 hover:text-gray-600 px-3"
            href="wallets.html"
          >
            Wallets
          </a>
          <a className="text-gray-800 hover:text-gray-600 px-3" href="#">
            About
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
