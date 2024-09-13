import e from "express";
import React, { useState } from "react";
import Button from "../components/Button";
import Select from "../components/Select";
import { useGetGetWalletDataQuery } from "../redux/Api";
import Loading from "../components/Loading";
import WalletTable from "../features/WalletTable";

export interface WalletData {
  name: string;
  link: string;
  data: Transaction[];
}
export interface Transaction {
  block: string;
  time: Date;
  amount: string;
  balance: string;
  balanceUSD: string;
  profit: string;
}

const Wallet = () => {
  const { data, isLoading } = useGetGetWalletDataQuery();
  const [index, setIndex] = useState<number>(0);
  const wallet = data !== undefined ? data[index] : undefined;
  const walletNames =
    data !== undefined
      ? data.map((wallet, i) => {
          return i + 1 + ". " + wallet.name;
        })
      : [];
  const walletLink = wallet !== undefined ? wallet.link : "";
  return (
    <section className="mx-auto container px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100  my-6">
        Explore the Crypto World
      </h2>
      <h3 className="text-xl text-gray-600 dark:text-gray-300">
        Advanced Analysis & Insights
      </h3>
      <p className="my-3 text-gray-700 dark:text-gray-300">
        Uncover the secrets of cryptocurrency markets with our advanced analysis
        tools. Dive into detailed reports and real-time data to make informed
        decisions.
      </p>
      <div>
        <form className="max-w-sm mx-auto flex-auto justify-between	mt-10">
          <div className="flex justify-between items-baseline">
            <div className="block mb-2 text-base font-medium text-gray-900 dark:text-gray-100">
              Select Wallet:
            </div>
            <div>
              <Button
                name={"Link to Wallet"}
                onClick={() => {
                  window.open(walletLink);
                }}
              ></Button>
            </div>
          </div>
          <Select
            options={walletNames}
            setSelectedOption={(i) => {
              setIndex(i);
            }}
          ></Select>
        </form>
      </div>

      <div className="mx-auto md:px-6 py-8 ">
        <Loading isLoading={isLoading}></Loading>
        <WalletTable Wallet={wallet} />
        <img
          className="my-4 mx-auto px-6 py-8"
          src="img/bg.jpg"
          alt="Crypto Analysis"
        />
        <a
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          href="#"
          target="_blank"
        >
          Learn More
        </a>
        <h3 className="text-lg font-semibold mt-6 text-gray-800 dark:text-gray-100">
          Real-Time Data
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          Stay ahead with real-time market data and trends.
        </p>
        <h3 className="text-lg font-semibold mt-6 text-gray-800 dark:text-gray-100">
          Comprehensive Reports
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          Access in-depth analysis and detailed market reports.
        </p>
      </div>
    </section>
  );
};
export default Wallet;
