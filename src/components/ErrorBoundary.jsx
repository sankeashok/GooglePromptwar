import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary Component
 * Captures runtime React errors to prevent the entire app from crashing.
 * Essential for "Mission-Critical" AI applications.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <AlertTriangle size={64} color="var(--urgent)" />
          <h2>System Interruption Detected</h2>
          <p>The intent resolution engine encountered an unexpected runtime state.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={18} />
            Reboot Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
