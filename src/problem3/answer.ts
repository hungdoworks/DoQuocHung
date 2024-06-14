/*

I assume all classes and imports are properly defined and included.

1. Extends the "FormattedWalletBalance" class from the "WalletBalance" class because almost all properties of "FormattedWalletBalance" are the same as those of "WalletBalance".
2. Remove the "Props" class because it is unnecessarily extended from the "BoxProps" interface.
3. Update "WalletPage" class with "BoxProps" instead of "Props" interface.
3. Extract the switch-case into an object "BlockchainPriority" that holds all the priorities of the blockchains.
Here are the reasons:
 - Code is easier to read.
 - The list of the blockchain types can be extended by updating the object "BlockchainPriority".
 - The "BlockchainPriority" object can be reused if needed.
4. Update "WalletBalance" class, add "blockchain" field.
5. Extract the "sortedBalances" into two block "filteredBalances" and "filteredAndSortedBalances" for clearer code, following "Single Responsibility" principle.
6. Put "formattedBalances" and "rows" into "useMemo" to avoid re-calculation.
7. Correct all the depenedencies for "filteredBalances", "filteredAndSortedBalances", "formattedBalances" and "rows".
8. If needed, extract the "getPriority" into an util class.
  If needed, extract the "filteredBalances", "filteredAndSortedBalances" and "formattedBalances" into a hook, take "prices" and "balances" as parameters, and return the formatted balances.

*/

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

const BlockchainPriority: any = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
  Unknown: -99,
};

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
  const { children, ...rest } = props;

  const balances = useWalletBalances();
  const prices = usePrices();

  function getPriority(blockchain: string): number {
    return BlockchainPriority[blockchain] ?? BlockchainPriority.Unknown;
  }

  const filteredBalances: WalletBalance[] = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);

      if (balancePriority === BlockchainPriority.Unknown || balance.amount > 0)
        return false;

      return true;
    });
  }, [balances, prices]);

  const filteredAndSortedBalances: WalletBalance[] = useMemo(() => {
    return filteredBalances.sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);

      if (leftPriority > rightPriority) {
        return -1;
      }

      return 1;
    });
  }, [filteredBalances]);

  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return filteredAndSortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    });
  }, [filteredAndSortedBalances]);

  const rows = useMemo(() => {
    return formattedBalances.map(
      (balance: FormattedWalletBalance, index: number) => {
        const usdValue: number = prices[balance.currency] * balance.amount;

        return;
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />;
      }
    );
  }, [formattedBalances]);

  return <div {...rest}>{rows}</div>;
};
