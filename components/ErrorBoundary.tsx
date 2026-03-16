"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-sm">
            <p className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">Something went wrong</p>
            <h2 className="text-foreground text-lg font-light">An unexpected error occurred</h2>
            <p className="text-muted-foreground/60 text-sm">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-2 rounded-lg border border-amber-400/30 text-amber-400/80 text-sm hover:bg-amber-400/10 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
