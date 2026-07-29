import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f1e" }}>
      <div className="text-center px-8">
        <h1 className="text-8xl font-bold mb-4"
          style={{
            background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
          404
        </h1>
        <p className="text-white text-xl font-medium mb-2">Page not found</p>
        <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-white font-medium px-8 py-3 rounded-lg border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
          >
            Go home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-white/60 font-medium px-8 py-3 rounded-lg border border-white/10 bg-transparent cursor-pointer hover:text-white transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound