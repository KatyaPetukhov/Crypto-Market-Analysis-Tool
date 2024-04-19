import React, { useState } from "react";
import { post } from "../services/api";
import Loading from "./Loading";

const Subscribe = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto px-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mt-20 ">
        Stay Updated
      </h2>
      <h3 className="text-xl text-center text-gray-600 dark:text-gray-300">
        Subscribe for Latest Updates
      </h3>

      <form className="flex flex-col justify-center mt-8 max-w-md mx-auto">
        <input
          className="border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md py-2 px-4 w-full"
          type="text"
          placeholder="Your Name"
          value={name}
          aria-label="Name"
          required
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          className="border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md py-2 px-4 w-full mt-4"
          type="email"
          placeholder="Your Email"
          value={mail}
          aria-label="Email"
          required
          onChange={(event) => {
            setMail(event.target.value);
          }}
        />

        {isLoading ? (
          <Loading isLoading={true}></Loading>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8 mb-20"
            type="submit"
            onClick={async (event) => {
              event.preventDefault();
              setIsLoading(true);
              // Send a POST request to the backend to register a subscriber and wait until it is done before setting the loading state to false
              await post("add-subscriber", { name: name, mail: mail });
              setTimeout(() => {
                setName("");
                setMail("");
                setIsLoading(false);
              }, 1000);
            }}
          >
            Subscribe
          </button>
        )}
      </form>
    </div>
  );
};
export default Subscribe;
