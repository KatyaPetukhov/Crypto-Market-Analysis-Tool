// Returns a styled header component.
import React from "react";
import { Link } from "react-router-dom";
import ToggleSwitch from "./ToggleSwitch";

const Header = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center w-full">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <p className="text-gray-800 hover:text-gray-600 px-3">
              <img className="h-14 w-14" src="img/logo/logo.svg" alt="logo" />
            </p>
          </Link>

          <Link to="/">
            <p className="hidden md:block font-bold text-indigo-800 dark:text-indigo-400 text-xl">
              Crypto Market Analysis Tool
            </p>
          </Link>
        </div>
        <div className="flex">
          <Link to="/">
            <p className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400  px-3">
              Home
            </p>
          </Link>

          <Link to="/wallet">
            <p className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400  px-3">
              Wallets
            </p>
          </Link>

          <Link to="/about">
            <p className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400  px-3">
              About
            </p>
          </Link>
          <ToggleSwitch></ToggleSwitch>
        </div>
      </div>
    </nav>
  );
};

export default Header;
