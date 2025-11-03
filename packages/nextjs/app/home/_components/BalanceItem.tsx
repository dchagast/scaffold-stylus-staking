"use client";

// Balance Item inside grid
export const BalanceItem = ({
  label,
  value,
  dark,
}: {
  label: string;
  value: string | number | React.ReactNode;
  dark: boolean;
}) => (
  <div
    className={`flex flex-col items-start justify-between rounded-lg p-3 transition-all ${
      dark
        ? "bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)]"
        : "bg-gray-50 border border-gray-100 hover:shadow-sm"
    }`}
  >
    <span className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
    <span className={`text-sm font-mono ${dark ? "text-gray-200" : "text-gray-700"}`}>{value}</span>
  </div>
);
