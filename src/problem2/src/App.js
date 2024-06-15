import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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

  function handleCurrencyChangeA(price) {
    setCurrencyPriceA(price);

    if (selectedPriceB !== "" && amountA === 0 && amountB > 0)
      setAmountA(calculateAmount(selectedPriceB, price, amountB));
    else if (selectedPriceB !== "")
      setAmountB(calculateAmount(price, selectedPriceB, amountA));
  }

  function handleCurrencyChangeB(price) {
    setCurrencyPriceB(price);

    if (selectedPriceA !== "" && amountA === 0 && amountB > 0)
      setAmountA(calculateAmount(price, selectedPriceA, amountB));
    else if (selectedPriceA !== "")
      setAmountB(calculateAmount(selectedPriceA, price, amountA));
  }

  function handleAmountChangeA(amount) {
    setAmountA(amount);

    if (selectedPriceA !== "" && selectedPriceB !== "")
      setAmountB(calculateAmount(selectedPriceA, selectedPriceB, amount));
  }

  function handleAmountChangeB(amount) {
    setAmountB(amount);

    if (selectedPriceA !== "" && selectedPriceB !== "")
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
    <Paper
      sx={{
        position: "absolute",
        top: "35%",
        left: "50%",
        translate: "-50% 0",
        width: "fit-content",
        padding: "48px",
      }}
      elevation={3}
    >
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          marginBottom: "36px",
          fontSize: "48px",
          fontWeight: "700",
        }}
      >
        Easy Swap
      </Typography>
      <Stack direction="row" spacing={2}>
        <CurrencyAutocomplete
          options={CurrencyPriceOptions}
          onCurrencyChange={handleCurrencyChangeA}
        />
        <TextField
          inputProps={{
            type: "number",
            min: 0,
            value: amountA.toFixed(2),
            onChange: (e) => handleAmountChangeA(+e.target.value),
          }}
        />
        <SwapHorizIcon sx={{ alignSelf: "center" }} />
        <CurrencyAutocomplete
          options={CurrencyPriceOptions}
          onCurrencyChange={handleCurrencyChangeB}
        />
        <TextField
          inputProps={{
            type: "number",
            min: 0,
            value: amountB.toFixed(2),
            onChange: (e) => handleAmountChangeB(+e.target.value),
          }}
        />
      </Stack>
    </Paper>
  );
}

export default App;
