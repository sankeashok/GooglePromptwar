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
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <AlertTriangle size={64} color="var(--urgent)" />
          <h2>System Interruption Detected</h2>
          <p>The intent resolution engine encountered an unexpected runtime state.</p>
          
          <div style={{ margin: '1.5rem 0', textAlign: 'left', width: '100%', maxWidth: '500px' }}>
            <button 
              className="btn-text" 
              onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}
            >
              {this.state.showDetails ? 'Hide' : 'Show'} Technical Details
            </button>
            
            {this.state.showDetails && (
              <pre style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '1rem', 
                borderRadius: '8px', 
                fontSize: '0.75rem', 
                overflow: 'auto',
                border: '1px solid var(--surface-border)',
                color: 'var(--urgent)'
              }}>
                {this.state.error?.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            )}
          </div>

          <button 
            className="button" 
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
