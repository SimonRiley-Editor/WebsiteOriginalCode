"use client";
import React from 'react';

export class ErrorBoundary extends React.Component<{children: React.ReactNode, fallback?: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-10 bg-red-900 text-white w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
          <pre className="bg-red-800 p-4 rounded text-sm overflow-auto max-w-full">
            {this.state.error?.toString()}
          </pre>
          <pre className="bg-red-950 p-4 rounded text-xs mt-4 max-w-full overflow-auto">
            {this.state.error?.stack}
          </pre>
          <button onClick={() => this.setState({hasError: false})} className="mt-4 px-4 py-2 bg-white text-red-900 rounded">Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
