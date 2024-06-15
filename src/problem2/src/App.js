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

  function handleCurrencyChangeA(price) {
    setCurrencyPriceA(price);

    setAmountB(calculateAmount(price, selectedPriceB, amountA));
  }

  function handleCurrencyChangeB(price) {
    setCurrencyPriceB(price);

    setAmountB(calculateAmount(selectedPriceA, price, amountA));
  }

  function handleAmountChangeA(amount) {
    setAmountA(amount);

    setAmountB(calculateAmount(selectedPriceA, selectedPriceB, amount));
  }

  function handleAmountChangeB(amount) {
    setAmountB(amount);

    setAmountA(calculateAmount(selectedPriceB, selectedPriceA, amount));
  }

  useEffect(() => {
    axios.get("https://interview.switcheo.com/prices.json").then((res) => {
      setPrices(res.data);
    });
  }, []);

  return (
    <>
      <select onChange={(e) => handleCurrencyChangeA(+e.target.value)}>
        {prices.map((price, index) => (
          <option key={index} value={price.price}>
            {price.currency}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={amountA}
        onChange={(e) => handleAmountChangeA(+e.target.value)}
      />
      <select onChange={(e) => handleCurrencyChangeB(+e.target.value)}>
        {prices.map((price, index) => (
          <option key={index} value={price.price}>
            {price.currency}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={amountB}
        onChange={(e) => handleAmountChangeB(+e.target.value)}
      />
    </>
  );
}

export default App;
