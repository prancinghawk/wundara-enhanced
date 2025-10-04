import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('🔐 Authentication error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h1 className="text-title-large mb-2">Authentication Setup Required</h1>
              <p className="text-body-medium text-on-surface-variant mb-4">
The app is running in development mode. Authentication is not configured, but you can still use all features.
              </p>
            </div>
            
            <div className="bg-surface-container-low rounded-lg p-4 mb-6 text-left">
              <h3 className="text-label-large font-medium mb-2">🔧 Development Mode</h3>
              <p className="text-body-small text-on-surface-variant mb-3">
                The app is running without authentication. You can:
              </p>
              <ul className="text-body-small text-on-surface-variant space-y-1">
                <li>• Create and manage child profiles</li>
                <li>• Generate personalized learning plans</li>
                <li>• View and track progress</li>
                <li>• Test all features without sign-up</li>
              </ul>
            </div>
            
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue to App
            </button>
            
            <div className="mt-4">
              <p className="text-body-small text-on-surface-variant">
                To enable authentication, run{' '}
                <code className="bg-surface-container px-2 py-1 rounded text-primary">./setup-auth.sh</code>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
