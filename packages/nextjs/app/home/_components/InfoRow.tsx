"use client";

export const InfoRow = ({
  label,
  value,
  dark,
}: {
  label: string;
  value: React.ReactNode | string | number;
  dark: boolean;
}) => (
  <div
    className={`flex items-center justify-between rounded-lg px-4 py-2 transition-all ${
      dark
        ? "bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)]"
        : "bg-gray-50 border border-gray-100 hover:shadow-sm"
    }`}
  >
    <span className={`font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>{label}</span>
    <span className={`font-mono ${dark ? "text-gray-200" : "text-gray-700"}`}>{value}</span>
  </div>
);
