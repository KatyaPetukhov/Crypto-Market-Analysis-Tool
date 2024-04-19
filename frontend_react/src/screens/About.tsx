import React from "react";
import Header from "../components/Header";
import Subscribe from "../components/Subscribe";

const Home = () => {
  return (
    <div className="pt-10 container mx-auto">
      <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 text-center dark:text-gray-200">
        Project: Crypto Market Analysis Tool
      </h1>
      <p className="mb-6 text-lg font-normal text-gray-500 dark:text-gray-300 text-center">
        B3. Crypto Market Analysis Tool: Build a tool that analyzes
        cryptocurrency market trends using historical data.
        <br />
        Implement features for predictive analytics, market sentiment analysis,
        and custom alerts for price changes.
      </p>
      <p className="text-center mb-4 dark:text-gray-300 ">
        <a
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          href="https://github.com/hadiDanial/Crypto-Market-Analysis-Tool"
        >
          GitHub
        </a>
      </p>
      <p className="mb-6 text-lg font-normal text-gray-500 text-center dark:text-gray-300 ">
        Frontend: <br />
        React + TypeScript <br />
        Hosted on GitHub Pages. <br />
        <br />
        Backend:
        <br />
        NodeJS + Express + Puppeteer
        <br /> Hosted on Heroku.
      </p>
      <p className="mb-6 text-lg font-normal text-gray-500 text-center dark:text-gray-300">
        Ekateryna Petukhov <br /> Hadi Danial <br /> Aharon Yonataev <br /> Niv
        Malka <br />
      </p>

      <Subscribe></Subscribe>
    </div>
  );
};

export default Home;
