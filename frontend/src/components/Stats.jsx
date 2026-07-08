const stats = [
  { num: "10k+", label: "Patients served" },
  { num: "500+", label: "Verified doctors" },
  { num: "98%", label: "Satisfaction rate" },
];

const Stats = () => {
  return (
    <div
      className="grid grid-cols-3 border-t border-b border-white/6"
      style={{ background: "#111827" }}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`flex flex-col items-center justify-center py-8 ${
            index !== stats.length - 1 ? "border-r border-white/6" : ""
          }`}
        >
          <span
            className="text-3xl font-medium mb-1"
            style={{
              background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {stat.num}
          </span>
          <span className="text-xs text-white/45">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Stats;