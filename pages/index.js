import { useCallback, useEffect, useState } from "react";
import { loadContract } from "../utils/loadContract";

import Web3 from "web3";

export default function Home() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    accounts: null,
    isLoading: true,
  });

  const [inputData, setInputData] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadProvider() {
      let provider = null;

      if (window.ethereum) {
        provider = window.ethereum;
        try {
          await provider.request({ method: "eth_requestAccounts" });
        } catch {
          console.error("User denied accounts access!");
        }
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      }

      if (provider) {
        const web3 = new Web3(provider);
        const contract = await loadContract("AdvancedStorage", web3);
        const accounts = await web3.eth.getAccounts();

        setWeb3Api({
          provider,
          web3,
          contract,
          accounts,
          isLoading: false,
        });
      }
    }

    loadProvider();
  }, []);

  async function onSubmit(event) {
    const { contract, accounts } = web3Api;
    event.preventDefault();

    await contract.methods.add(inputData).send({ from: accounts[0] });
    const data = await getData();
    setData(data);
  }

  const getData = useCallback(async () => {
    const { isLoading } = web3Api;
    if (!isLoading) {
      const { contract } = web3Api;
      const data = await contract.methods.getAll().call();
      return data;
    }
  }, [web3Api]);

  useEffect(() => {
    if (data) {
      async function fetchData() {
        const data = await getData();
        setData(data);
      }

      fetchData();
    }
  }, [getData, data]);

  return (
    <div className="max-w-5xl mx-auto pt-4">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Advanced storage</h1>
        <form className="space-y-2" onSubmit={(event) => onSubmit(event)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="data" className="font-semibold">
              Set data (number)
            </label>
            <input
              onChange={({ target: { value } }) => setInputData(value)}
              value={inputData}
              type="number"
              id="data"
              className="py-2 px-4 outline-none border border-gray-200 bg-gray-200 hover:border-indigo-500 hover:bg-white hover:shadow-out focus:border-indigo-500 focus:bg-white focus:shadow-out rounded-md transition-all"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-indigo-500 text-white rounded-md hover:shadow-out transition-all"
          >
            Submit
          </button>
        </form>
        <div>Data: {data && <span>{data.join(", ")}</span>}</div>
      </div>
    </div>
  );
}
