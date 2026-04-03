import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {this.state.error && (
              <div className="mb-8 p-4 bg-gray-50 rounded-xl text-left overflow-auto max-h-48 border border-gray-100">
                <p className="text-xs font-mono text-red-600 break-words">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <p className="text-[10px] font-mono text-gray-400 mt-2 whitespace-pre text-nowrap">
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 px-6 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <RefreshCw size={20} />
              Reload Page
            </button>
            
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
            >
              Try to recover
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
