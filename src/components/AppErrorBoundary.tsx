import React from "react";

interface AppErrorBoundaryState {
  error?: Error;
}

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("GeoLux 3D runtime error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="app-error" role="alert">
          <h1>GeoLux 3D no pudo cargar correctamente.</h1>
          <p>Revisa la consola del navegador.</p>
          <pre>{this.state.error.message}</pre>
        </main>
      );
    }

    return this.props.children;
  }
}
