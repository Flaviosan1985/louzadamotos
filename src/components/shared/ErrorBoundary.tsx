"use client";

import { Component, Fragment, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  resetKey: number;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    resetKey: 0,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-svh items-center justify-center p-6">
          <div className="bg-card max-w-md rounded-xl border p-6">
            <h2 className="text-lg font-semibold">Algo deu errado</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {this.state.error?.message}
            </p>
            <Button
              className="mt-4"
              onClick={() =>
                this.setState((current) => ({
                  hasError: false,
                  error: null,
                  resetKey: current.resetKey + 1,
                }))
              }
            >
              Tentar de novo
            </Button>
          </div>
        </div>
      );
    }

    return <Fragment key={this.state.resetKey}>{this.props.children}</Fragment>;
  }
}
