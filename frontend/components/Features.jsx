const features = [
  {
    icon: "ti-brain",
    color: "#4f8ef7",
    bg: "rgba(79,142,247,0.15)",
    title: "AI symptom checker",
    desc: "Describe your symptoms and get an instant AI-powered health assessment.",
  },
  {
    icon: "ti-calendar-check",
    color: "#10b981",
    bg: "rgba(16,185,129,0.15)",
    title: "Smart appointments",
    desc: "Book, reschedule, or cancel appointments with verified doctors in seconds.",
  },
  {
    icon: "ti-shield-check",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.15)",
    title: "Role-based access",
    desc: "Separate dashboards for patients, doctors, and admins.",
  },
  {
    icon: "ti-file-text",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.15)",
    title: "Medical records",
    desc: "Securely store and access your health history anytime, from anywhere.",
  },
];

const Features = () => {
  return (
    <section className="px-8 py-20" style={{ background: "#0a0f1e" }}>
      {/* Label */}
      <p className="text-xs font-medium text-center uppercase tracking-widest text-blue-400 mb-2">
        Features
      </p>

      {/* Title */}
      <h2 className="text-3xl font-medium text-center text-white mb-2">
        Everything you need in one place
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-white/45 text-center mb-12">
        From AI-powered symptom checking to smart appointment scheduling.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-6 border border-white/8 transition-all duration-200 hover:border-blue-400/40"
            style={{ background: "#111827" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: f.bg }}
            >
              <i className={`ti ${f.icon} text-xl`} style={{ color: f.color }} />
            </div>
            <h3 className="text-sm font-medium text-white mb-2">{f.title}</h3>
            <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;