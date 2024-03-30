import React from "react";
import { WalletData } from "../screens/Wallet";
interface WalletTableProps {
  Wallet: WalletData | undefined;
}

const WalletTable: React.FC<WalletTableProps> = (props) => {
  if (props.Wallet === undefined) return <p> No Data</p>;
  return (
    <table className="table mx-auto px-6 py-8">
      <thead>
        <tr className="text-left">
          <th className="p-2">Block</th>
          <th className="p-2 hidden md:block">Time</th>
          <th className="p-2">Amount</th>
          <th className="p-2">Balance</th>
          <th className="p-2">Balance USD</th>
          <th className="p-2 hidden md:block">Profit</th>
        </tr>
      </thead>
      <tbody key={"TableBody"}>
        {props.Wallet.data.map((row, index) => {
          const classes = row[2].startsWith("+")
            ? "text-green-800 w-auto p-2 align-top border-b border-gray-200"
            : "text-red-800 w-auto p-2 align-top border-b border-gray-200";

          const key =
            props.Wallet !== undefined ? props.Wallet.name + index : index;
          return (
            <tr key={key} className="text-left">
              <td className="w-auto p-2 align-top border-b border-gray-200">
                {row[0]}
              </td>
              <td className="w-auto p-2 align-top border-b border-gray-200 hidden md:block">
                {row[1]}
              </td>
              <td className={classes}>{row[2]}</td>
              <td className="w-auto p-2 align-top border-b border-gray-200">
                {row[3]}
              </td>
              <td className="w-auto p-2 align-top border-b border-gray-200">
                {row[4]}
              </td>
              <td className="w-auto p-2 align-top border-b border-gray-200 hidden md:block">
                {row[5]}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default WalletTable;
