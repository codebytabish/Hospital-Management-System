const steps = [
  {
    num: "1",
    title: "Create an account",
    desc: "Sign up as a patient or doctor in under a minute.",
  },
  {
    num: "2",
    title: "Check your symptoms",
    desc: "Let our AI analyze your symptoms and suggest next steps.",
  },
  {
    num: "3",
    title: "Book an appointment",
    desc: "Choose a verified doctor and pick a time that suits you.",
  },
  {
    num: "4",
    title: "Get better",
    desc: "Consult your doctor and track your health progress.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="px-8 py-20 border-t border-b border-white/6"
      style={{ background: "#111827" }}
    >
      {/* Label */}
      <p className="text-xs font-medium text-center uppercase tracking-widest text-blue-400 mb-2">
        How it works
      </p>

      {/* Title */}
      <h2 className="text-3xl font-medium text-center text-white mb-2">
        Up and running in minutes
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-white/45 text-center mb-12">
        Simple steps to better healthcare.
      </p>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex flex-col items-center text-center px-4 py-6"
          >
            {/* Number bubble */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium mb-4"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              {step.num}
            </div>
            <h3 className="text-sm font-medium text-white mb-2">{step.title}</h3>
            <p className="text-xs text-white/45 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;