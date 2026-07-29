import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f1e" }}>
          <div className="text-center px-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(239,68,68,0.1)" }}>
              <i className="ti ti-alert-triangle text-2xl text-red-400" />
            </div>
            <h1 className="text-white text-xl font-medium mb-2">Something went wrong</h1>
            <p className="text-white/40 text-sm mb-6">An unexpected error occurred. Please try again.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="text-sm text-white font-medium px-8 py-3 rounded-lg border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              Go home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary