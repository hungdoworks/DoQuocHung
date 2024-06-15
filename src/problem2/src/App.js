import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { CurrencyAutocomplete } from "./CurrencyAutocomplete";

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

  const CurrencyPriceOptions = useMemo(() => {
    return prices.map((price, index) => ({
      key: `${price.currency}_${index}`,
      label: price.currency,
      value: price.price,
    }));
  }, [prices]);

  useEffect(() => {
    axios.get("https://interview.switcheo.com/prices.json").then((res) => {
      setPrices(res.data);
    });
  }, []);

  return (
    <>
      <CurrencyAutocomplete
        options={CurrencyPriceOptions}
        onCurrencyChange={handleCurrencyChangeA}
      />
      <TextField
        inputProps={{
          type: "number",
          min: 0,
          value: amountA,
          onChange: (e) => handleAmountChangeA(+e.target.value),
        }}
      />
      <CurrencyAutocomplete
        options={CurrencyPriceOptions}
        onCurrencyChange={handleCurrencyChangeB}
      />
      <TextField
        inputProps={{
          type: "number",
          min: 0,
          value: amountB,
          onChange: (e) => handleAmountChangeB(+e.target.value),
        }}
      />
    </>
  );
}

export default App;
