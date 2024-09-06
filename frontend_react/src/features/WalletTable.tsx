// Returns the table that containes  all the wallets.
import React from "react";
import { WalletData } from "../screens/Wallet";
interface WalletTableProps {
  Wallet: WalletData | undefined;
}

const WalletTable: React.FC<WalletTableProps> = (props) => {
  if (props.Wallet === undefined) return <p> No Data</p>;
  return (
    <div className="overflow-x-auto">
      <table className="table mx-auto md:px-6 py-8">
        <thead>
          <tr className="text-left">
            <th className="p-2 dark:text-gray-200">Block</th>
            <th className="p-2 hidden md:table-cell dark:text-gray-200">
              Time
            </th>
            <th className="p-2 dark:text-gray-200">Amount</th>
            <th className="p-2 dark:text-gray-200">Balance</th>
            <th className="p-2 hidden md:table-cell dark:text-gray-200">
              Balance USD
            </th>
            <th className="p-2 hidden md:table-cell dark:text-gray-200">
              Profit
            </th>
          </tr>
        </thead>
        <tbody key={"TableBody"}>
          {props.Wallet.data.map((row, index) => {
            const classes = row.amount.startsWith("+")
              ? "text-green-800 dark:text-green-300 w-auto p-2 align-top border-b border-gray-200 dark:border-gray-700"
              : "text-red-800 dark:text-red-300 w-auto p-2 align-top border-b border-gray-200 dark:border-gray-700";

            const key =
              props.Wallet !== undefined ? props.Wallet.name + index : index;
            return (
              <tr key={key} className="text-left">
                <td className="w-auto p-2 align-top border-b border-gray-200 dark:border-gray-700 dark:text-gray-200">
                  {row.block}
                </td>
                <td className="w-auto p-2 align-top border-b border-gray-200 hidden md:table-cell dark:border-gray-700 dark:text-gray-200">
                  {row.time.toString().split("T")[0]}
                </td>
                <td className={classes}>{row.amount}</td>
                <td className="w-auto p-2 align-top border-b border-gray-200 dark:border-gray-700 dark:text-gray-200">
                  {row.balance}
                </td>
                <td className="w-auto p-2 align-top border-b border-gray-200 hidden md:table-cell dark:border-gray-700 dark:text-gray-200">
                  {row.balanceUSD}
                </td>
                <td className="w-auto p-2 align-top border-b border-gray-200 hidden md:table-cell dark:border-gray-700 dark:text-gray-200">
                  {row.profit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default WalletTable;
