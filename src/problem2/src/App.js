import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [prices, setPrices] = useState([]);
  const [selectedPriceA, setCurrencyPriceA] = useState("");
  const [selectedPriceB, setCurrencyPriceB] = useState("");
  const [amountA, setAmountA] = useState(0);
  const [amountB, setAmountB] = useState(0);

  function calculateAmount(currencyA, currencyB, currencyValue) {
    const exchangeRate = currencyA / currencyB;
    return currencyValue * exchangeRate;
  }

  function canCalulate() {
    if (selectedPriceA === "" || selectedPriceB === "") return false;
    return true;
  }

  function handleCurrencyChangeA(price) {
    setCurrencyPriceA(price);

    if (canCalulate())
      setAmountB(calculateAmount(price, selectedPriceB, amountA));
  }

  function handleCurrencyChangeB(price) {
    setCurrencyPriceB(price);

    if (canCalulate())
      setAmountB(calculateAmount(selectedPriceA, price, amountA));
  }

  function handleAmountChangeA(amount) {
    setAmountA(amount);

    if (canCalulate())
      setAmountB(calculateAmount(selectedPriceA, selectedPriceB, amount));
  }

  function handleAmountChangeB(amount) {
    setAmountB(amount);

    if (canCalulate())
      setAmountA(calculateAmount(selectedPriceB, selectedPriceA, amount));
  }

  useEffect(() => {
    axios.get("https://interview.switcheo.com/prices.json").then((res) => {
      setPrices(res.data);
    });
  }, []);

  return (
    <>
      <select
        defaultValue=""
        onChange={(e) => handleCurrencyChangeA(+e.target.value)}
      >
        <option value="" disabled hidden>
          Select currency
        </option>
        {prices.map((price, index) => (
          <option key={index} value={price.price}>
            {price.currency}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        value={amountA}
        onChange={(e) => handleAmountChangeA(+e.target.value)}
      />
      <select
        defaultValue=""
        onChange={(e) => handleCurrencyChangeB(+e.target.value)}
      >
        <option value="" disabled hidden>
          Select currency
        </option>
        {prices.map((price, index) => (
          <option key={index} value={price.price}>
            {price.currency}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        value={amountB}
        onChange={(e) => handleAmountChangeB(+e.target.value)}
      />
    </>
  );
}

export default App;
