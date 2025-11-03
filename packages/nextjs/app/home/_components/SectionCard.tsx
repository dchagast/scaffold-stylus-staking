"use client";

export const SectionCard = ({
  title,
  emoji,
  isDarkMode,
  children,
}: {
  title: string;
  emoji: string;
  isDarkMode: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={`rounded-3xl p-6 transition-all duration-300 shadow-md flex flex-col gap-4 ${
      isDarkMode
        ? "bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)]"
        : "bg-white border border-gray-100 hover:shadow-lg"
    }`}
  >
    <div className="flex items-center gap-2 mb-3">
      <span className={`text-xl ${isDarkMode ? "text-pink-400" : "text-[#2563EB]"}`}>{emoji}</span>
      <h2 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{title}</h2>
    </div>
    {children}
  </div>
);
