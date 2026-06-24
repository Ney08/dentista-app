import React from "react";

class ErrorBoundary extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      hasError: false,
      error: null
    };

  }

  static getDerivedStateFromError(error) {

    return {
      hasError: true,
      error
    };

  }

  componentDidCatch(error, info) {

    console.error(
      "ERROR BOUNDARY:",
      error,
      info
    );

  }

  render() {

    if (this.state.hasError) {

      return (

        <div
          style={{
            background: "#020617",
            color: "white",
            minHeight: "100vh",
            padding: "32px",
            fontFamily: "Consolas, monospace",
            whiteSpace: "pre-wrap"
          }}
        >

          <h1
            style={{
              color: "#f87171"
            }}
          >
            Error renderizando la app
          </h1>

          <p>
            {String(
              this.state.error?.message ||
              this.state.error
            )}
          </p>

          <hr />

          <pre>
            {this.state.error?.stack || "Sin stack"}
          </pre>

        </div>

      );

    }

    return this.props.children;

  }

}

export default ErrorBoundary;