import React from "react";

const Prediction = () => {
  return (
    <section className="bg-white py-8">
      <div className="flex flex-col items-center px-8 mt-10 ">
        <input
          disabled
          max="5"
          step="1"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer "
        />
        <div
          id="rate_circles"
          className="w-full flex justify-between text-xs mx-auto"
        >
          <span className="mt-1 text-base w-24 text-center transform -translate-y-3">
            <img
              src="./img/circle-solid.svg"
              alt=""
              className="w-6 mx-auto hidden"
            />
          </span>
          <span className="mt-1 text-base w-24 text-center transform -translate-y-3">
            <img
              src="./img/circle-solid.svg"
              alt=""
              className="w-6 mx-auto hidden"
            />
          </span>
          <span className="mt-1 text-base w-24 text-center transform -translate-y-3 ">
            <img
              src="./img/circle-solid.svg"
              alt=""
              className="w-6 mx-auto hidden"
            />
          </span>
          <span className="mt-1 text-base w-24 text-center transform -translate-y-3 ">
            <img
              src="./img/circle-solid.svg"
              alt=""
              className="w-6 mx-auto hidden"
            />
          </span>
          <span className="mt-1 text-base w-24 text-center transform -translate-y-3">
            <img
              src="./img/circle-solid.svg"
              alt=""
              className="w-6 mx-auto hidden"
            />
          </span>
        </div>

        <div id="rate_labels" className="w-full flex justify-between text-xs ">
          <span className="mt-1 text-base w-24 text-center">Sell</span>
          <span className="mt-1 text-base w-24 text-center"></span>
          <span className="mt-1 text-base w-24 text-center">Hold</span>
          <span className="mt-1 text-base w-24 text-center"></span>
          <span className="mt-1 text-base w-24 text-center">Buy</span>
        </div>
      </div>
    </section>
  );
};

export default Prediction;
