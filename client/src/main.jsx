import { createRoot } from "react-dom/client";
import './index.css'

import App from "./App.jsx";
import AppProviders from "./context/AppProviders.jsx";

createRoot(document.getElementById("root")).render(
  <AppProviders>
    <App />
  </AppProviders>
);