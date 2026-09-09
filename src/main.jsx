import React from "react"
import ReactDOM from "react-dom/client"
import App from "./p6-prep-maths.jsx"
import ParentView from "./parent-view.jsx"
import "./index.css"

function Root() {
  const path = window.location.pathname;
  if (path === "/parent" || path.startsWith("/parent")) {
    return React.createElement(ParentView);
  }
  return React.createElement(App);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(React.StrictMode, null, React.createElement(Root))
)
