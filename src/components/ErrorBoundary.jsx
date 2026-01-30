import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You could log to an external service here
    // console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong.</h2>
          <p>We captured an unexpected error. Please try reloading the page.</p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#a00' }}>{String(this.state.error)}</pre>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => window.location.reload()} style={{ padding: '8px 12px' }}>Reload</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
