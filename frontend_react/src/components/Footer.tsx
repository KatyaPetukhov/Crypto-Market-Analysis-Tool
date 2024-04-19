import React from "react";

const Footer = () => {
  return (
    <div className=" mx-auto text-center">
      <footer className="bg-white dark:bg-gray-800 py-6">
        <small>
          <a
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
            href="#"
          >
            Privacy Policy
          </a>{" "}
          •{" "}
          <a
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
            href="#"
          >
            Terms of Service
          </a>
        </small>
      </footer>
    </div>
  );
};

export default Footer;
