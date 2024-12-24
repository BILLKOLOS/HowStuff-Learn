import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <div className="error-content">
            <div>
              <h2 className="error-title">
                Something went wrong
              </h2>
              <div className="error-message">
                <details className="error-details">
                  <summary className="error-summary">
                    Error details
                  </summary>
                  <pre className="error-stack">
                    {this.state.error?.toString()}
                  </pre>
                </details>
              </div>
            </div>
            <div>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="retry-button"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
