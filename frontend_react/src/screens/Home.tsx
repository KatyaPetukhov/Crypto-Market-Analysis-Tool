import React from "react";
import Header from "../components/Header";
import Chart from "../features/Chart";
import Prediction from "../features/Prediction";
import Subscribe from "../components/Subscribe";

const Home = () => {
  return (
    <div>
      <Chart></Chart>
      <Prediction></Prediction>
      <Subscribe></Subscribe>
    </div>
  );
};

export default Home;
