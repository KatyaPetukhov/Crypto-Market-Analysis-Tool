import React from "react";
import Header from "../components/Header";
import Chart from "../components/Chart";
import Prediction from "../components/Prediction";

const Home = () => {
  return (
    <div className="bg-gray-100">
      <Header></Header>
      <Chart></Chart>
      <Prediction></Prediction>

      {/* <div className="container mx-auto px-6">
    <h2 className="text-2xl font-bold text-center text-gray-800 mt-28">Stay Updated</h2>
    <h3 className="text-xl text-center text-gray-600">Subscribe for Latest Updates</h3>
    <form className="flex flex-col justify-center mt-8 max-w-md mx-auto">
        <input className="border rounded-md py-2 px-4 w-full" type="text" placeholder="Your Name" aria-label="Name" required>
        <input className="border rounded-md py-2 px-4 w-full mt-4" type="email" placeholder="Your Email" aria-label="Email" required>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8" type="submit">Subscribe</button>
    </form>
</div> */}
      {/* <footer className="bg-white py-6">
    <div className="container mx-auto px-6 text-center">
        <small><a className="text-blue-500 hover:text-blue-700" href="#">Privacy Policy</a> • <a className="text-blue-500 hover:text-blue-700" href="#">Terms of Service</a></small>
    </footer>
  </div> */}
    </div>
  );
};

export default Home;
