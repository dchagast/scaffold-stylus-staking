"use client";

export const ActionButton = ({
  label,
  gradientFrom,
  gradientTo,
  outline = false,
  dark = false,
  disabled = false,
  onClick,
}: {
  label: string;
  gradientFrom?: string;
  gradientTo?: string;
  outline?: boolean;
  dark?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  if (outline) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`font-semibold py-2.5 rounded-xl border transition-all duration-200 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : dark
              ? "border-gray-600 text-gray-200 hover:bg-[rgba(255,255,255,0.08)]"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-semibold py-2.5 rounded-xl shadow-md transition-all duration-200 bg-gradient-to-r ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{
        backgroundImage: disabled ? undefined : `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        color: "#fff",
      }}
    >
      {label}
    </button>
  );
};
