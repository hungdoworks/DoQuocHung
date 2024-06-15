import Box from "@mui/material//Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export function CurrencyAutocomplete({ options, onCurrencyChange }) {
  return (
    <Autocomplete
      options={options}
      onChange={(e, v) => onCurrencyChange(v.value)}
      renderOption={(props, option) => (
        <Box {...props} gap={2} key={option.key}>
          <img
            loading="lazy"
            width="20"
            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${option.label}.svg`}
            alt=""
          />
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ minWidth: "200px" }}
          label="Choose a currency"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
    />
  );
}
