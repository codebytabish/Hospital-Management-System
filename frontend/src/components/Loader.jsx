const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f1e" }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm">{text}</p>
      </div>
    </div>
  )
}

export default Loader