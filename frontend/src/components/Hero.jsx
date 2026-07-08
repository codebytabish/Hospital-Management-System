import { useNavigate } from 'react-router-dom'
const Hero = () => {
  const navigate = useNavigate()
  return (
    <section
      className="flex flex-col items-center text-center px-8 py-24 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,142,247,0.18) 0%, transparent 70%), #0a0f1e",
      }}
    >
      {/* Purple glow bottom right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(168,85,247,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Badge */}
      <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-6">
        <i className="ti ti-sparkles text-sm" />
        Powered by Gemini AI
      </div>

      {/* Heading */}
      <h1 className="relative text-5xl font-medium leading-tight max-w-2xl text-white mb-5 animate-pulse">
        Smart healthcare,{" "}<br/>
        <span
          style={{
            background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          simplified
        </span>{" "}
        for everyone
      </h1>

      {/* Subtext */}
      <p className="relative text-base text-white/50 max-w-lg leading-relaxed mb-10">
        SynaptoClin connects patients with doctors, checks your symptoms with
        AI, and manages appointments — all in one place.
      </p>

      {/* Buttons */}
      <div className="relative flex items-center gap-3 flex-wrap justify-center">
       <button
          onClick={() => navigate('/get-started')}
          className="text-white text-sm font-medium px-8 py-3 rounded-lg border-none cursor-pointer"
          style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
        >
          Get started free
        </button>
      <button
          onClick={() => navigate('/book-appointment')}
          className="text-sm text-white font-medium px-8 py-3 rounded-lg border border-white/30 bg-transparent cursor-pointer hover:bg-white/10 transition-colors"
        >
          Book appointment
        </button>
      </div>
    </section>
  );
};

export default Hero;