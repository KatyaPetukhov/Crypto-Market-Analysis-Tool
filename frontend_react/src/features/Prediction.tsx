//"Black Box" function, not implemented yet.
//This block needs to get wallets history info and build Bitcoin predictions according
// to this info by AI.
//On this level we don't do implementation to this, so it creates random prediction.

import React from "react";
import { useGetGetWalletDataQuery } from "../redux/Api";

function getRandomNumber() {
  return Math.floor(Math.random() * 5);
}

interface PredictionCircleProps {
  isHidden: boolean;
}

const Prediction = () => {
  const { data } = useGetGetWalletDataQuery();
  const circles: boolean[] = new Array(5).fill(true);
  const setData = (data: any) => {
    circles[getRandomNumber()] = false;
    // TODO: Implement AI prediction...
  };
  setData(circles);

  return (
    <section className="bg-white py-8">
      <h3 className="text-center">Prediction for today:</h3>
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
          {circles.map((value, index) => {
            return <PredictionCircle isHidden={value} key={index}/>;
          })}
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

const PredictionCircle: React.FC<PredictionCircleProps> = (props) => {
  const classes = props.isHidden ? "w-6 mx-auto hidden" : "w-6 mx-auto";
  return (
    <span className="mt-1 text-base w-24 text-center transform -translate-y-5">
      <img src="img/circle-solid.svg" alt="" className={classes} />
    </span>
  );
};

export default Prediction;
