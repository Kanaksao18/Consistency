import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Frontend Crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white font-display">
          <div className="max-w-md text-center space-y-8">
            <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto ring-1 ring-rose-500/50">
              <span className="text-4xl">⚠️</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black uppercase tracking-widest leading-tight">Momentum Interrupted</h1>
              <p className="text-slate-400 font-medium italic">An unexpected anomaly has occurred in the matrix. Don't worry, your mission data is safe.</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-primary-500/20"
            >
              Re-materialize App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
