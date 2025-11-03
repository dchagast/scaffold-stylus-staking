export const formatTokenBalanceStr = (balance: bigint | undefined, decimals = 18, symbol = "") => {
  if (!balance) return `0 ${symbol}`;

  // Convert from BigInt, string, or number safely
  const bn = BigInt(balance);

  // Compute integer and fractional parts
  const divisor = 10n ** BigInt(decimals);
  const whole = bn / divisor;
  const fraction = bn % divisor;

  // Format fractional part to show up to 4 decimals (trim trailing zeros)
  let fractionStr = fraction.toString().padStart(decimals, "0").slice(0, 4);
  fractionStr = fractionStr.replace(/0+$/, "");

  return fractionStr.length ? `${whole.toString()}.${fractionStr} ${symbol}` : `${whole.toString()} ${symbol}`;
};
