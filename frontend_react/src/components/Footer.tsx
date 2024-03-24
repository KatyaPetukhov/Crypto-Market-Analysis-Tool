import React from "react";

const Footer = () => {
  return (
    <div className="container mx-auto px-6 text-center">
      <footer className="bg-white py-6">
        <small>
          <a className="text-blue-500 hover:text-blue-700" href="#">
            Privacy Policy
          </a>{" "}
          •{" "}
          <a className="text-blue-500 hover:text-blue-700" href="#">
            Terms of Service
          </a>
        </small>
      </footer>
    </div>
  );
};

export default Footer;
