import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-grey-50 px-4 dark:bg-grey-900">
          <div className="w-full max-w-md space-y-6 rounded-2xl border-2 border-grey-200 bg-white p-8 text-center dark:border-grey-700 dark:bg-grey-800">
            <div className="bg-red-100 dark:bg-red-900/30 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <svg
                className="text-red-600 dark:text-red-400 h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl text-grey-900 dark:text-grey-100">
                Something went wrong
              </h1>
              <p className="font-body text-base text-grey-600 dark:text-grey-400">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            {this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer font-body text-sm text-grey-600 hover:text-grey-800 dark:text-grey-400 dark:hover:text-grey-200">
                  Error details
                </summary>
                <pre className="mt-2 overflow-auto rounded-lg bg-grey-100 p-4 font-mono text-xs text-grey-800 dark:bg-grey-900 dark:text-grey-200">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-xl border border-primary-800 bg-primary-700 px-6 py-3 font-body text-base font-semibold text-primary-50 uppercase transition hover:bg-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
