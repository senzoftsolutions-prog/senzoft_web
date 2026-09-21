import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionPreferences } from "./components/ui/MotionPreferences";
import App from "./app/App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MotionPreferences>
        <App />
      </MotionPreferences>
    </BrowserRouter>
  </StrictMode>,
);
